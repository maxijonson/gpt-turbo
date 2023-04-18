import dotenv from "dotenv";
import isValidSnowflake from "../utils/isValidSnowflake.js";
dotenv.config();

export const DISCORD_TOKEN = process.env.DISCORD_TOKEN!;

export const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID!;

export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export const WHITELIST_USERS = (
    process.env.WHITELIST_USERS?.split(",") ?? []
).filter(Boolean);

export const BLACKLIST_USERS = (
    process.env.BLACKLIST_USERS?.split(",") ?? []
).filter(Boolean);

export const WHITELIST_GUILDS = (
    process.env.WHITELIST_GUILDS?.split(",") ?? []
).filter(Boolean);

export const BLACKLIST_GUILDS = (
    process.env.BLACKLIST_GUILDS?.split(",") ?? []
).filter(Boolean);

export const ALLOW_BOTS: string[] | boolean = (() => {
    const allowBots = process.env.ALLOW_BOTS;

    if (allowBots === "true") {
        return true;
    }

    if (allowBots === "false") {
        return false;
    }

    if (allowBots) {
        return allowBots.split(",");
    }

    return false;
})();

export const ALLOW_DMS = (process.env.ALLOW_DMS || "false") === "true";

if (!DISCORD_TOKEN) {
    throw new Error(
        "DISCORD_TOKEN is not defined in the environment variables"
    );
}

if (!DISCORD_CLIENT_ID) {
    throw new Error(
        "DISCORD_CLIENT_ID is not defined in the environment variables"
    );
}

for (const userId of [...WHITELIST_USERS, ...BLACKLIST_USERS]) {
    if (!isValidSnowflake(userId)) {
        throw new Error(`"${userId}" is not a valid user ID`);
    }
}

for (const guildId of [...WHITELIST_GUILDS, ...BLACKLIST_GUILDS]) {
    if (!isValidSnowflake(guildId)) {
        throw new Error(`"${guildId}" is not a valid guild ID`);
    }
}

if (ALLOW_BOTS && Array.isArray(ALLOW_BOTS)) {
    for (const botId of ALLOW_BOTS) {
        if (!isValidSnowflake(botId)) {
            throw new Error(`"${botId}" is not a valid bot ID`);
        }
    }
}
