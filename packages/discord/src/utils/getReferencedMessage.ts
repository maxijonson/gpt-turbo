import { Message } from "discord.js";
import getMessageById from "./getMessageById.js";

/**
 * When `message` is a reply to another message, this function returns the referenced message.
 */
export default async (message: Message<boolean>) => {
    try {
        const reference = message.reference;
        if (!reference?.messageId) {
            return null;
        }
        const referencedMessage = await getMessageById(
            reference.channelId,
            reference.messageId,
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
