import {
    Interaction,
    Awaitable,
    StringSelectMenuInteraction,
    ButtonBuilder,
    ButtonStyle,
} from "discord.js";
import InteractionHandler from "../../InteractionHandler.js";
import isBotAdmin from "../../../utils/isBotAdmin.js";
import { ADMIN_MENU_ID } from "../../../config/constants.js";
import AdminUsageResetAllHandler from "./AdminUsageResetAllHandler.js";
import getHandlerId from "../../../utils/getHandlerId.js";
import setupInteractionCleanup from "../../../utils/setupInteractionCleanup.js";
import reply from "../../../utils/reply.js";
import UserSelect from "../../../components/UserSelect.js";
import AdminUsageResetUserHandler from "./AdminUsageResetUserHandler.js";
import UserIdButton from "../../../components/UserIdButton.js";

export default class AdminUsageResetMenuHandler extends InteractionHandler {
    public static readonly ID = getHandlerId(AdminUsageResetMenuHandler.name);
    public static readonly USER_ID_MODAL_ID = `${AdminUsageResetMenuHandler.ID}_user-id-modal`;

    public get name(): string {
        return AdminUsageResetMenuHandler.name;
    }

    protected canHandle(interaction: Interaction): Awaitable<boolean> {
        return (
            isBotAdmin(interaction.user.id) &&
            interaction.isStringSelectMenu() &&
            interaction.customId === ADMIN_MENU_ID &&
            interaction.values[0] === AdminUsageResetMenuHandler.ID
        );
    }

    protected async handle(
        interaction: StringSelectMenuInteraction
    ): Promise<void> {
        await reply(interaction, {
            content: "Whose usage would you like to reset?",
            components: [
                this.createMessageActionRow().addComponents(
                    new UserSelect(AdminUsageResetUserHandler.ID)
                ),
                this.createMessageActionRow().addComponents(
                    new UserIdButton(
                        AdminUsageResetMenuHandler.USER_ID_MODAL_ID
                    ),
                    new ButtonBuilder()
                        .setCustomId(AdminUsageResetAllHandler.ID)
                        .setLabel("Everyone")
                        .setEmoji("🌍")
                        .setStyle(ButtonStyle.Secondary)
                ),
            ],
            ephemeral: true,
        });
        setupInteractionCleanup(interaction);
    }
}
