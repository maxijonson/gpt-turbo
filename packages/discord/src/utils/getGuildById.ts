import { Client } from "discord.js";

export default (guildId: string, client: Client) => {
    return client.guilds.cache.get(guildId) || client.guilds.fetch(guildId);
};
