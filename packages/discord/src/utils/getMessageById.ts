import { Client } from "discord.js";
import getChannelById from "./getChannelById.js";

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
