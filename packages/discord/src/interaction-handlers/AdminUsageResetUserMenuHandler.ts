import {
    Interaction,
    Awaitable,
    ButtonInteraction,
    UserSelectMenuBuilder,
    ButtonBuilder,
    ButtonStyle,
} from "discord.js";
import InteractionHandler from "./InteractionHandler.js";
import isBotAdmin from "../utils/isBotAdmin.js";
import AdminUsageResetUserHandler from "./AdminUsageResetUserHandler.js";
import AdminUsageResetUserShowModalHandler from "./AdminUsageResetUserShowModalHandler.js";
import getHandlerId from "../utils/getHandlerId.js";
import setupInteractionCleanup from "../utils/setupInteractionCleanup.js";

export default class AdminUsageResetUserMenuHandler extends InteractionHandler {
    public static readonly ID = getHandlerId(
        AdminUsageResetUserMenuHandler.name
    );

    public get name(): string {
        return AdminUsageResetUserMenuHandler.name;
    }

    protected canHandle(interaction: Interaction): Awaitable<boolean> {
        return (
            isBotAdmin(interaction.user.id) &&
            interaction.isButton() &&
            interaction.customId === AdminUsageResetUserMenuHandler.ID
        );
    }

    protected async handle(interaction: ButtonInteraction): Promise<void> {
        await interaction.reply({
            content: "Which user would you like to reset the usage of?",
            ephemeral: true,
            components: [
                this.createMessageActionRow().addComponents(
                    new UserSelectMenuBuilder()
                        .setCustomId(AdminUsageResetUserHandler.ID)
                        .setPlaceholder("Select a user")
                        .setMinValues(1)
                        .setMaxValues(1)
                ),
                this.createMessageActionRow().addComponents(
                    new ButtonBuilder()
                        .setCustomId(AdminUsageResetUserShowModalHandler.ID)
                        .setLabel("Enter user ID")
                        .setEmoji("🆔")
                        .setStyle(ButtonStyle.Secondary)
                ),
            ],
        });
        setupInteractionCleanup(interaction);
    }
}
