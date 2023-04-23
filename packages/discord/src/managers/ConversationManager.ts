import { ChatCompletionRequestMessageRoleEnum, Conversation } from "gpt-turbo";
import getConversationConfig from "../utils/getConversationConfig.js";
import BotException from "../exceptions/BotException.js";
import QuotaManager from "./QuotaManager.js";
import { ConversationUser } from "../utils/types.js";

export default class ConversationManager {
    constructor(private readonly quotaManager: QuotaManager) {}

    public async getChatCompletion(
        messages: (
            | { content: string; role: ChatCompletionRequestMessageRoleEnum }
            | string
        )[],
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

        const response = await conversation.getChatCompletionResponse();
        await conversation.addAssistantMessage(response.content);

        await this.quotaManager.logUsage(conversation);
        return response;
    }

    private getAlternatedMessages(
        messages: (
            | { content: string; role: ChatCompletionRequestMessageRoleEnum }
            | string
        )[]
    ): { content: string; role: ChatCompletionRequestMessageRoleEnum }[] {
        const alternatedMessages: {
            content: string;
            role: ChatCompletionRequestMessageRoleEnum;
        }[] = [];

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
