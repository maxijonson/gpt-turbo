import { Message } from "discord.js";
import getMessageById from "./getMessageById.js";

export default async (message: Message<boolean>) => {
    try {
        const reference = message.reference!;
        const referencedMessage = await getMessageById(
            reference.guildId!,
            reference.channelId,
            reference.messageId!,
            message.client
        );

        if (!referencedMessage) {
            return null;
        }

        return referencedMessage;
    } catch (error) {
        return null;
    }
};
