import { Events } from "discord.js";
import createDiscordEvent from "../utils/createDiscordEvent.js";

const readyEvent = createDiscordEvent(
    Events.ClientReady,
    async (client) => {
        console.info(`Ready! Logged in as ${client.user.tag}`);
    },
    true
);

export default readyEvent;
