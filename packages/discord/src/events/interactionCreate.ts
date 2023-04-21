import { Events } from "discord.js";
import createDiscordEvent from "../utils/createDiscordEvent.js";
import MessageHandler from "../message-handlers/MessageHandler.js";

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

        if (
            interaction.client.isOnCooldown(interaction.user.id, "interaction")
        ) {
            await interaction.reply({
                content: MessageHandler.COOLDOWN_MESSAGE,
                ephemeral: true,
            });
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
