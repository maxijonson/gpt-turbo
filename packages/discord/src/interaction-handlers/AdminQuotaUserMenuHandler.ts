import {
    Interaction,
    Awaitable,
    StringSelectMenuInteraction,
    ButtonBuilder,
    ButtonStyle,
    UserSelectMenuBuilder,
} from "discord.js";
import InteractionHandler from "./InteractionHandler.js";
import isBotAdmin from "../utils/isBotAdmin.js";
import { ADMIN_MENU_ID } from "../config/constants.js";
import getHandlerId from "../utils/getHandlerId.js";
import setupInteractionCleanup from "../utils/setupInteractionCleanup.js";
import reply from "../utils/reply.js";
import AdminQuotaUserIdModalHandler from "./AdminQuotaUserIdModalHandler.js";
import AdminQuotaUserHandler from "./AdminQuotaUserHandler.js";

export default class AdminQuotaUserMenuHandler extends InteractionHandler {
    public static readonly ID = getHandlerId(AdminQuotaUserMenuHandler.name);

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
                    new UserSelectMenuBuilder()
                        .setCustomId(AdminQuotaUserHandler.ID)
                        .setPlaceholder("Select a user")
                        .setMinValues(1)
                        .setMaxValues(1)
                ),
                this.createMessageActionRow().addComponents(
                    new ButtonBuilder()
                        .setCustomId(AdminQuotaUserIdModalHandler.ID)
                        .setLabel("Enter user ID")
                        .setEmoji("🆔")
                        .setStyle(ButtonStyle.Secondary)
                ),
            ],
        });
        setupInteractionCleanup(interaction);
    }
}
