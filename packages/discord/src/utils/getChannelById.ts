import { Client } from "discord.js";
import getGuildById from "./getGuildById.js";

export default async (guildId: string, channelId: string, client: Client) => {
    const guild = await getGuildById(guildId, client);
    if (!guild) {
        return null;
    }

    return (
        guild.channels.cache.get(channelId) || guild.channels.fetch(channelId)
    );
};
