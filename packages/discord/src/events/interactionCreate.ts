import { Events } from "discord.js";
import createDiscordEvent from "../utils/createDiscordEvent.js";

export default createDiscordEvent(
    Events.InteractionCreate,
    async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commandManager.commands.get(
            interaction.commandName
        );

        if (!command) {
            console.error(
                `No command matching ${interaction.commandName} was found.`
            );
            return;
        }

        try {
            await interaction.deferReply({
                ephemeral: command.ephemeral ?? true,
            });
            await command.execute(interaction);
        } catch (error) {
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: "There was an error while executing this command!",
                    ephemeral: true,
                });
            } else {
                await interaction.reply({
                    content: "There was an error while executing this command!",
                    ephemeral: true,
                });
            }
            throw error;
        }
    }
);