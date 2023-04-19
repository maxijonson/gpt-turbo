import { Events } from "discord.js";
import createDiscordEvent from "../utils/createDiscordEvent.js";

export default createDiscordEvent(
    Events.ClientReady,
    async (client) => {
        console.info(`Ready! Logged in as ${client.user.tag}`);
    },
    true
);
