import { Message, Awaitable, ThreadAutoArchiveDuration } from "discord.js";
import MessageHandler from "./MessageHandler.js";
import getCleanContent from "../utils/getCleanContent.js";
import getPromptAndReplyMessages from "../utils/getPromptAndReplyMessages.js";

export default class ReplyHandler extends MessageHandler {
    public get name(): string {
        return ReplyHandler.name;
    }

    protected canHandle(message: Message<boolean>): Awaitable<boolean> {
        return (
            !message.channel.isDMBased() &&
            message.channel.isTextBased() &&
            message.reference !== null &&
            message.reference.guildId !== undefined &&
            message.reference.messageId !== undefined
        );
    }

    protected async handle(message: Message<boolean>): Promise<void> {
        const [originalPromptMessage, originalReplyMessage] =
            await getPromptAndReplyMessages(message);
        if (originalPromptMessage === null || originalReplyMessage === null) {
            return;
        }

        // eslint-disable-next-line prefer-const
        let [originalPrompt, originalReply, prompt] = await Promise.all([
            getCleanContent(originalPromptMessage),
            getCleanContent(originalReplyMessage),
            getCleanContent(message),
        ]);
        if (!originalPrompt) {
            originalPrompt = "Hello";
        }

        const slicedOriginalPrompt =
            originalPrompt.length > 100
                ? `${originalPrompt.slice(0, 97)}...`
                : originalPrompt;

        const [{ content }, thread] = await Promise.all([
            message.client.conversationManager.getChatCompletion(
                [originalPrompt, originalReply, prompt],
                message.author.id
            ),
            message
                .startThread({
                    name: slicedOriginalPrompt,
                    autoArchiveDuration: ThreadAutoArchiveDuration.OneHour,
                    rateLimitPerUser: 5,
                    reason: `Reply to "${slicedOriginalPrompt}"`,
                })
                .then((t) => {
                    t.sendTyping();
                    return t;
                }),
        ]);

        await thread.send(content);
    }
}
