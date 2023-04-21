import { Client } from "discord.js";

export default async (channelId: string, client: Client) => {
    return (
        client.channels.cache.get(channelId) ||
        (await client.channels.fetch(channelId))
    );
};
