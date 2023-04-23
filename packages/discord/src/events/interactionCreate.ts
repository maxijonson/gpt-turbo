import { Events } from "discord.js";
import createDiscordEvent from "../utils/createDiscordEvent.js";
import MessageHandler from "../message-handlers/MessageHandler.js";
import BotException from "../exceptions/BotException.js";

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
            let content = "There was an error while executing this command!";
            let rethrow = true;

            if (error instanceof BotException) {
                content = error.message;
                rethrow = false;
            }

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content,
                    ephemeral: true,
                });
            } else {
                await interaction.reply({
                    content,
                    ephemeral: true,
                });
            }

            if (rethrow) throw error;
        }
    }
);
