import {
    Interaction,
    Awaitable,
    ChatInputCommandInteraction,
    Colors,
} from "discord.js";
import InteractionHandler from "./InteractionHandler.js";
import BotException from "../exceptions/BotException.js";
import reply from "../utils/reply.js";

export default class SlashCommandHandler extends InteractionHandler {
    public get name(): string {
        return SlashCommandHandler.name;
    }

    protected canHandle(interaction: Interaction): Awaitable<boolean> {
        return interaction.isChatInputCommand();
    }

    protected async handle(
        interaction: ChatInputCommandInteraction
    ): Promise<void> {
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
            let content = "There was an error while executing this command!";
            let rethrow = true;

            if (error instanceof BotException) {
                content = error.message;
                rethrow = false;
            }

            await reply(interaction, {
                embeds: [
                    {
                        title: "Error",
                        description: content,
                        color: Colors.Red,
                    },
                ],
                ephemeral: true,
            });

            if (rethrow) throw error;
        }
    }
}
