import { Client } from "discord.js";

/**
 * Gets the channel by its ID from the cache or fetches it from the API.
 */
export default async (channelId: string, client: Client) => {
    return (
        client.channels.cache.get(channelId) ||
        (await client.channels.fetch(channelId))
    );
};
