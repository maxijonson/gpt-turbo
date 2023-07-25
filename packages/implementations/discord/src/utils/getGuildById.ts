import { Client } from "discord.js";

/**
 * Gets the guild by its ID from the cache or fetches it from the API.
 */
export default (guildId: string, client: Client) => {
    return client.guilds.cache.get(guildId) || client.guilds.fetch(guildId);
};
