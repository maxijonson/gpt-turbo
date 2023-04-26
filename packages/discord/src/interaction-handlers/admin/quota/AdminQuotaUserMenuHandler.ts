import {
    Interaction,
    Awaitable,
    StringSelectMenuInteraction,
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

export default class AdminQuotaUserMenuHandler extends InteractionHandler {
    public static readonly ID = getHandlerId(AdminQuotaUserMenuHandler.name);
    public static readonly USER_ID_MODAL_ID = `${AdminQuotaUserMenuHandler.ID}_user-id-modal`;

    public get name(): string {
        return AdminQuotaUserMenuHandler.name;
    }

    protected canHandle(interaction: Interaction): Awaitable<boolean> {
        return (
            isBotAdmin(interaction.user.id) &&
            interaction.isStringSelectMenu() &&
            interaction.customId === ADMIN_MENU_ID &&
            interaction.values[0] === AdminQuotaUserMenuHandler.ID
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
                    new UserIdButton(AdminQuotaUserMenuHandler.USER_ID_MODAL_ID)
                ),
            ],
        });
        setupInteractionCleanup(interaction);
    }
}
