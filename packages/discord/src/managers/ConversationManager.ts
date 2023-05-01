import { Conversation, MessageModel } from "gpt-turbo";
import getConversationConfig from "../utils/getConversationConfig.js";
import BotException from "../exceptions/BotException.js";
import QuotaManager from "./QuotaManager.js";
import { ConversationUser } from "../utils/types.js";

export default class ConversationManager {
    constructor(private readonly quotaManager: QuotaManager) {}

    public async getChatCompletion(
        messages: (MessageModel | string)[],
        userId: string
    ) {
        const user: ConversationUser = `discord-${userId}`;
        const conversation = await Conversation.fromMessages(
            this.getAlternatedMessages(messages),
            getConversationConfig({
                user,
            })
        );

        if (!(await this.quotaManager.isConversationAllowed(conversation))) {
            throw new BotException(
                "You have exceeded your quota. Please try again later, if the bot admins reset it."
            );
        }
        const quota = await this.quotaManager.getQuota(user);
        const usage = await this.quotaManager.getUsage(user);
        const minUsage = usage + conversation.getSize();
        const maxTokens = Math.min(quota - minUsage, 1000);

        if (maxTokens <= 0) {
            throw new BotException(
                "You have exceeded your quota. Please try again later, if the bot admins reset it."
            );
        }

        const response = await conversation.getChatCompletionResponse({
            max_tokens: maxTokens,
        });

        try {
            await conversation.addAssistantMessage(response.content);
        } finally {
            await this.quotaManager.logUsage(conversation);
        }

        return response;
    }

    private getAlternatedMessages(
        messages: (MessageModel | string)[]
    ): MessageModel[] {
        const alternatedMessages: MessageModel[] = [];

        messages.forEach((message, index) => {
            alternatedMessages.push({
                content:
                    typeof message === "string" ? message : message.content,
                role:
                    typeof message === "string"
                        ? index % 2 === 0
                            ? "user"
                            : "assistant"
                        : message.role,
            });
        });

        return alternatedMessages;
    }
}
