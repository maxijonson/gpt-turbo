import { Message, Awaitable, ThreadAutoArchiveDuration } from "discord.js";
import MessageHandler from "./MessageHandler.js";
import getCleanContent from "../utils/getCleanContent.js";
import { Conversation } from "gpt-turbo";
import getConversationConfig from "../utils/getConversationConfig.js";
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

        const [originalPrompt, originalReply, prompt] = await Promise.all([
            getCleanContent(originalPromptMessage),
            getCleanContent(originalReplyMessage),
            getCleanContent(message),
        ]);
        const slicedOriginalPrompt =
            originalPrompt.length > 100
                ? `${originalPrompt.slice(0, 97)}...`
                : originalPrompt;

        const [conversation, thread] = await Promise.all([
            Conversation.fromMessages(
                [originalPrompt, originalReply],
                getConversationConfig()
            ),
            message.startThread({
                name: slicedOriginalPrompt,
                autoArchiveDuration: ThreadAutoArchiveDuration.OneHour,
                rateLimitPerUser: 5,
                reason: `Reply to "${slicedOriginalPrompt}"`,
            }),
        ]);

        const [{ content }] = await Promise.all([
            conversation.prompt(prompt),
            thread.sendTyping(),
        ]);
        await thread.send(content);
    }
}
