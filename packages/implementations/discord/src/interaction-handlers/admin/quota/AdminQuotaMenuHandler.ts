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
import getHandlerId from "../../../utils/getHandlerId.js";
import setupInteractionCleanup from "../../../utils/setupInteractionCleanup.js";
import reply from "../../../utils/reply.js";
import AdminQuotaUserHandler from "./AdminQuotaUserHandler.js";
import UserIdButton from "../../../components/UserIdButton.js";
import UserSelect from "../../../components/UserSelect.js";
import RoleSelect from "../../../components/RoleSelect.js";
import AdminQuotaRoleHandler from "./AdminQuotaRoleHandler.js";

export default class AdminQuotaMenuHandler extends InteractionHandler {
    public static readonly ID = getHandlerId(AdminQuotaMenuHandler.name);
    public static readonly USER_ID_MODAL_ID = `${AdminQuotaMenuHandler.ID}_user-id-modal`;
    public static readonly ROLE_ID_MODAL_ID = `${AdminQuotaMenuHandler.ID}_role-id-modal`;

    public get name(): string {
        return AdminQuotaMenuHandler.name;
    }

    protected canHandle(interaction: Interaction): Awaitable<boolean> {
        return (
            isBotAdmin(interaction.user.id) &&
            interaction.isStringSelectMenu() &&
            interaction.customId === ADMIN_MENU_ID &&
            interaction.values[0] === AdminQuotaMenuHandler.ID
        );
    }

    protected async handle(
        interaction: StringSelectMenuInteraction
    ): Promise<void> {
        await reply(interaction, {
            content: "Whose quota would like to manage?",
            ephemeral: true,
            components: [
                this.createMessageActionRow().addComponents(
                    new UserSelect(AdminQuotaUserHandler.ID)
                ),
                this.createMessageActionRow().addComponents(
                    new RoleSelect(AdminQuotaRoleHandler.ID)
                ),
                this.createMessageActionRow().addComponents(
                    new UserIdButton(AdminQuotaMenuHandler.USER_ID_MODAL_ID),
                    new ButtonBuilder()
                        .setCustomId(AdminQuotaMenuHandler.ROLE_ID_MODAL_ID)
                        .setLabel("Enter Role ID")
                        .setEmoji("🆔")
                        .setStyle(ButtonStyle.Secondary)
                ),
            ],
        });
        setupInteractionCleanup(interaction);
    }
}
