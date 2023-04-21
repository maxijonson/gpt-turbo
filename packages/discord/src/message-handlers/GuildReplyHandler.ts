import {
    Message,
    Awaitable,
    bold,
    ThreadAutoArchiveDuration,
} from "discord.js";
import MessageHandler from "./MessageHandler.js";
import getCleanContent from "../utils/getCleanContent.js";
import { Client } from "discord.js";
import BotException from "../exceptions/BotException.js";
import { Conversation } from "gpt-turbo";
import getConversationConfig from "../utils/getConversationConfig.js";

export default class ReplyHandler extends MessageHandler {
    public get name(): string {
        return ReplyHandler.name;
    }

    protected canHandle(message: Message<boolean>): Awaitable<boolean> {
        return (
            message.reference !== null &&
            message.reference.guildId !== undefined &&
            message.reference.messageId !== undefined &&
            !message.channel.isDMBased()
        );
    }

    protected async handle(message: Message<boolean>): Promise<void> {
        const repliedMessage = await this.getReferencedMessage(message);
        if (!repliedMessage || repliedMessage.author.id !== message.client.id) {
            return;
        }

        if (!message.content) {
            throw new BotException(
                `I can't see your message! This usually happens if you don't enable pinging when you reply. Make sure the '@' icon to the right of the message box is a blue '${bold(
                    "@ ON"
                )}' instead of a grey '${bold("@ OFF")}' and try again!`
            );
        }
        const originalMessage = await this.getReferencedMessage(repliedMessage);
        if (!originalMessage) {
            throw new BotException(
                "I can't find your original prompt message. It may have been deleted."
            );
        }

        const [originalPrompt, repliedPrompt, prompt] = await Promise.all([
            getCleanContent(originalMessage),
            getCleanContent(repliedMessage),
            getCleanContent(message),
        ]);

        const thread = await message.startThread({
            name: originalPrompt,
            autoArchiveDuration: ThreadAutoArchiveDuration.OneHour,
            rateLimitPerUser: 5,
            reason: `Reply to "${originalPrompt}"`,
        });

        const conversation = await Conversation.fromMessages(
            [originalPrompt, repliedPrompt],
            getConversationConfig()
        );
        const [{ content }] = await Promise.all([
            conversation.prompt(prompt),
            thread.sendTyping(),
        ]);
        await thread.send(content);
    }

    private async getGuildById(guildId: string, client: Client) {
        return client.guilds.cache.get(guildId) || client.guilds.fetch(guildId);
    }

    private async getChannelById(
        guildId: string,
        channelId: string,
        client: Client
    ) {
        const guild = await this.getGuildById(guildId, client);
        if (!guild) {
            return null;
        }

        return (
            guild.channels.cache.get(channelId) ||
            guild.channels.fetch(channelId)
        );
    }

    private async getMessageById(
        guildId: string,
        channelId: string,
        messageId: string,
        client: Client
    ) {
        const channel = await this.getChannelById(guildId, channelId, client);
        if (!channel?.isTextBased()) {
            return null;
        }

        return (
            channel.messages.cache.get(messageId) ||
            channel.messages.fetch(messageId)
        );
    }

    private async getReferencedMessage(message: Message<boolean>) {
        const reference = message.reference!;
        const referencedMessage = await this.getMessageById(
            reference.guildId!,
            reference.channelId,
            reference.messageId!,
            message.client
        );

        if (!referencedMessage) {
            return null;
        }

        return referencedMessage;
    }
}
