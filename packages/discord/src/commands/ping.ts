import { SlashCommandBuilder } from "discord.js";
import { DiscordSlashCommand } from "../utils/types.js";
import reply from "../utils/reply.js";

const pingCommand: DiscordSlashCommand = {
    builder: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with Pong!"),
    execute: async (interaction) => {
        if (!interaction.isRepliable()) return;
        await reply(interaction, "Pong!");
    },
    ephemeral: true,
};

export default pingCommand;
