import {
    ActionRowBuilder,
    MessageActionRowComponentBuilder,
    SlashCommandBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
} from "discord.js";
import { DiscordSlashCommand } from "../utils/types.js";
import { ADMINS } from "../config/env.js";
import BotException from "../exceptions/BotException.js";
import { ADMIN_MENU_ID } from "../config/constants.js";
import AdminUsageResetMenuHandler from "../interaction-handlers/admin/usage-reset/AdminUsageResetMenuHandler.js";
import setupInteractionCleanup from "../utils/setupInteractionCleanup.js";
import reply from "../utils/reply.js";
import AdminQuotaUserMenuHandler from "../interaction-handlers/admin/quota/AdminQuotaMenuHandler.js";

const adminCommand: DiscordSlashCommand = {
    builder: new SlashCommandBuilder()
        .setName("admin")
        .setDescription("Commands reserved to bot admins."),
    execute: async (interaction) => {
        if (!interaction.isRepliable() || !interaction.isChatInputCommand())
            return;
        if (!ADMINS.includes(interaction.user.id))
            throw new BotException(
                "You are not authorized to use this command."
            );

        await reply(interaction, {
            content: "What would you like to do?",
            components: [
                new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId(ADMIN_MENU_ID)
                        .setPlaceholder("Select an action")
                        .setMinValues(1)
                        .setMaxValues(1)
                        .setOptions([
                            new StringSelectMenuOptionBuilder()
                                .setLabel("Reset usage")
                                .setDescription(
                                    "Reset the usage of a user or all users."
                                )
                                .setEmoji("🔄")
                                .setValue(AdminUsageResetMenuHandler.ID),
                            new StringSelectMenuOptionBuilder()
                                .setLabel("Manage quotas")
                                .setDescription("Manage the quotas for a user")
                                .setEmoji("📊")
                                .setValue(AdminQuotaUserMenuHandler.ID),
                        ])
                ),
            ],
        });

        setupInteractionCleanup(interaction);
    },
    ephemeral: true,
};

export default adminCommand;
