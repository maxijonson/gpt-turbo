import { Client } from "discord.js";
import getChannelById from "./getChannelById.js";

/**
 * Gets the message by its ID from the cache or fetches it from the API.
 */
export default async (channelId: string, messageId: string, client: Client) => {
    const channel = await getChannelById(channelId, client);
    if (!channel?.isTextBased()) {
        return null;
    }

    return (
        channel.messages.cache.get(messageId) ||
        channel.messages.fetch(messageId)
    );
};
