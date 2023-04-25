import {
    Interaction,
    Awaitable,
    ButtonInteraction,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
} from "discord.js";
import InteractionHandler from "./InteractionHandler.js";
import isBotAdmin from "../utils/isBotAdmin.js";
import AdminUsageResetUserIdHandler from "./AdminUsageResetUserIdHandler.js";
import getHandlerId from "../utils/getHandlerId.js";

export default class AdminUsageResetUserShowModalHandler extends InteractionHandler {
    public static readonly ID = getHandlerId(
        AdminUsageResetUserShowModalHandler.name
    );

    public get name(): string {
        return AdminUsageResetUserShowModalHandler.name;
    }

    protected canHandle(interaction: Interaction): Awaitable<boolean> {
        return (
            isBotAdmin(interaction.user.id) &&
            interaction.isButton() &&
            interaction.customId === AdminUsageResetUserShowModalHandler.ID
        );
    }

    protected async handle(interaction: ButtonInteraction): Promise<void> {
        const modal = new ModalBuilder()
            .setCustomId(AdminUsageResetUserIdHandler.ID)
            .setTitle("Reset Usage by User ID")
            .addComponents(
                this.createModalActionRow().addComponents(
                    new TextInputBuilder()
                        .setCustomId("userId")
                        .setLabel("Enter the user ID")
                        .setPlaceholder("123456789012345678")
                        .setMinLength(18)
                        .setMaxLength(18)
                        .setRequired(true)
                        .setStyle(TextInputStyle.Short)
                )
            );

        await interaction.showModal(modal);
    }
}
