import {
    Interaction,
    Awaitable,
    ButtonInteraction,
    ModalBuilder,
} from "discord.js";
import InteractionHandler from "./InteractionHandler.js";
import isBotAdmin from "../utils/isBotAdmin.js";
import getHandlerId from "../utils/getHandlerId.js";
import createUserIdInput from "../components/createUserIdInput.js";
import AdminQuotaUserHandler from "./AdminQuotaUserHandler.js";

export default class AdminQuotaUserIdModalHandler extends InteractionHandler {
    public static readonly ID = getHandlerId(AdminQuotaUserIdModalHandler.name);

    public get name(): string {
        return AdminQuotaUserIdModalHandler.name;
    }

    protected canHandle(interaction: Interaction): Awaitable<boolean> {
        return (
            isBotAdmin(interaction.user.id) &&
            interaction.isButton() &&
            interaction.customId === AdminQuotaUserIdModalHandler.ID
        );
    }

    protected async handle(interaction: ButtonInteraction): Promise<void> {
        const modal = new ModalBuilder()
            .setCustomId(AdminQuotaUserHandler.ID)
            .setTitle("Reset Usage by User ID")
            .addComponents(
                this.createModalActionRow().addComponents(createUserIdInput())
            );

        await interaction.showModal(modal);
    }
}
