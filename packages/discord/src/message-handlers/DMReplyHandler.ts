import { Message, Awaitable } from "discord.js";
import MessageHandler from "./MessageHandler.js";
import getPromptAndReplyMessages from "../utils/getPromptAndReplyMessages.js";
import BotException from "../exceptions/BotException.js";
import getCleanContent from "../utils/getCleanContent.js";
import { ChatCompletionRequestMessageRoleEnum } from "gpt-turbo";

export default class DMReplyHandler extends MessageHandler {
    public get name(): string {
        return DMReplyHandler.name;
    }

    protected canHandle(message: Message<boolean>): Awaitable<boolean> {
        return (
            message.channel.isDMBased() &&
            message.channel.isTextBased() &&
            message.reference !== null &&
            message.reference.messageId !== undefined
        );
    }

    protected async handle(message: Message<boolean>): Promise<void> {
        let [previousPromptMessage, previousReplyMessage] =
            await getPromptAndReplyMessages(message);
        const messages: Message[] = [];

        while (
            previousPromptMessage !== null &&
            previousReplyMessage !== null
        ) {
            messages.unshift(previousReplyMessage);
            messages.unshift(previousPromptMessage);
            [previousPromptMessage, previousReplyMessage] =
                await getPromptAndReplyMessages(previousPromptMessage);
        }

        if (messages.length === 0) {
            throw new BotException("No messages found in chain of replies.");
        }

        const [conversationMessages, prompt] = await Promise.all([
            Promise.all(
                messages.map(
                    async (
                        m
                    ): Promise<{
                        content: string;
                        role: ChatCompletionRequestMessageRoleEnum;
                    }> => ({
                        content: (await getCleanContent(m)) || "Hello",
                        role:
                            m.author.id === message.author.id
                                ? "user"
                                : "assistant",
                    })
                )
            ),
            getCleanContent(message),
        ]);

        const [{ content }] = await Promise.all([
            message.client.conversationManager.getChatCompletion(
                [...conversationMessages, prompt],
                message.author.id
            ),
            message.channel.sendTyping(),
        ]);

        await message.reply(content);
    }
}
