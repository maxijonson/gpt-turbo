import dotenv from "dotenv";
dotenv.config();

export const DISCORD_TOKEN = process.env.DISCORD_TOKEN!;

export const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID!;

export const DISCORD_TEST_SERVER_ID = process.env.DISCORD_TEST_SERVER_ID;

export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

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
