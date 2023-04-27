import { Events } from "discord.js";
import createDiscordEvent from "../utils/createDiscordEvent.js";

export default createDiscordEvent(
    Events.InteractionCreate,
    async (interaction) => {
        interaction.client.handleInteraction(interaction);
    }
);
