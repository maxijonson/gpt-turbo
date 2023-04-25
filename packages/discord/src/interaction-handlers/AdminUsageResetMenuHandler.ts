import {
    Interaction,
    Awaitable,
    StringSelectMenuInteraction,
    ButtonBuilder,
    ButtonStyle,
} from "discord.js";
import InteractionHandler from "./InteractionHandler.js";
import isBotAdmin from "../utils/isBotAdmin.js";
import { ADMIN_MENU_ID } from "../config/constants.js";
import AdminUsageResetAllHandler from "./AdminUsageResetAllHandler.js";
import AdminUsageResetUserMenuHandler from "./AdminUsageResetUserMenuHandler.js";
import getHandlerId from "../utils/getHandlerId.js";
import setupInteractionCleanup from "../utils/setupInteractionCleanup.js";

export default class AdminUsageMenuHandler extends InteractionHandler {
    public static readonly ID = getHandlerId(AdminUsageMenuHandler.name);

    public get name(): string {
        return AdminUsageMenuHandler.name;
    }

    protected canHandle(interaction: Interaction): Awaitable<boolean> {
        return (
            isBotAdmin(interaction.user.id) &&
            interaction.isStringSelectMenu() &&
            interaction.customId === ADMIN_MENU_ID &&
            interaction.values[0] === AdminUsageMenuHandler.ID
        );
    }

    protected async handle(
        interaction: StringSelectMenuInteraction
    ): Promise<void> {
        await interaction.reply({
            content: "Whose usage would you like to reset?",
            components: [
                this.createMessageActionRow().addComponents(
                    new ButtonBuilder()
                        .setCustomId(AdminUsageResetAllHandler.ID)
                        .setLabel("Everyone")
                        .setEmoji("🌍")
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId(AdminUsageResetUserMenuHandler.ID)
                        .setLabel("User")
                        .setEmoji("🙎‍♂️")
                        .setStyle(ButtonStyle.Primary)
                ),
            ],
            ephemeral: true,
        });
        setupInteractionCleanup(interaction);
    }
}
