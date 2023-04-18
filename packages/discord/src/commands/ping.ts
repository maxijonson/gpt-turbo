import { SlashCommandBuilder } from "discord.js";
import { DiscordSlashCommand } from "../utils/types.js";

const pingCommand: DiscordSlashCommand = {
    builder: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with Pong!"),
    execute: async (interaction) => {
        if (!interaction.isRepliable()) return;
        await interaction.reply("Pong!");
    },
};

export default pingCommand;
