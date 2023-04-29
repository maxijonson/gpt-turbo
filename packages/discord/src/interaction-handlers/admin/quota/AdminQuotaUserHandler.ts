import {
    Interaction,
    Awaitable,
    UserSelectMenuInteraction,
    ModalSubmitInteraction,
    Colors,
    italic,
    ButtonBuilder,
    ButtonStyle,
    DiscordjsError,
    DiscordjsErrorCodes,
    RepliableInteraction,
    ModalBuilder,
    ButtonInteraction,
    TextInputStyle,
} from "discord.js";
import InteractionHandler from "../../InteractionHandler.js";
import isBotAdmin from "../../../utils/isBotAdmin.js";
import getHandlerId from "../../../utils/getHandlerId.js";
import reply from "../../../utils/reply.js";
import setupInteractionCleanup from "../../../utils/setupInteractionCleanup.js";
import { TextInputBuilder } from "@discordjs/builders";
import BotException from "../../../exceptions/BotException.js";
import { DEFAULT_INTERACTION_WAIT } from "../../../config/constants.js";
import SnowflakeModalHandler from "../../SnowflakeModalHandler.js";

export default class AdminQuotaUserHandler extends InteractionHandler {
    public static readonly ID = getHandlerId(AdminQuotaUserHandler.name);
    private static readonly BUTTON_SET_ID = `${AdminQuotaUserHandler.ID}_button-set`;
    private static readonly BUTTON_RESET_ID = `${AdminQuotaUserHandler.ID}_button-reset`;
    private static readonly MODAL_SET_ID = `${AdminQuotaUserHandler.ID}_modal-set`;
    private static readonly QUOTA_INPUT_ID = `${AdminQuotaUserHandler.ID}_quota-input`;

    public get name(): string {
        return AdminQuotaUserHandler.name;
    }

    protected canHandle(interaction: Interaction): Awaitable<boolean> {
        return (
            isBotAdmin(interaction.user.id) &&
            (interaction.isUserSelectMenu() || interaction.isModalSubmit()) &&
            interaction.customId === AdminQuotaUserHandler.ID
        );
    }

    protected async handle(
        interaction: UserSelectMenuInteraction | ModalSubmitInteraction
    ): Promise<void> {
        const { quotaManager } = interaction.client;
        const userId = interaction.isModalSubmit()
            ? interaction.fields.getTextInputValue(
                  SnowflakeModalHandler.INPUT_ID
              )
            : interaction.values[0];

        const quota = await quotaManager.getQuota(userId);
        const hasQuota = await quotaManager.hasUserQuota(userId);
        const [quotaRole] = await quotaManager.getUserQuotaRole(userId);

        const quotaFormat = Intl.NumberFormat("en-US", {
            style: "decimal",
            maximumFractionDigits: 0,
        }).format(quota);
        const quotaType = (() => {
            if (hasQuota) {
                return "";
            }
            return `(${italic(quotaRole?.name ?? "default")})`;
        })();

        const usage = await quotaManager.getUsage(userId);
        const usagePercent = new Intl.NumberFormat("en-US", {
            style: "percent",
            maximumFractionDigits: 0,
        }).format(usage / quota);

        const row = this.createMessageActionRow().addComponents(
            new ButtonBuilder()
                .setCustomId(AdminQuotaUserHandler.BUTTON_SET_ID)
                .setLabel("Set Quota")
                .setStyle(ButtonStyle.Primary)
                .setEmoji("🔧")
        );

        if (hasQuota) {
            row.addComponents(
                new ButtonBuilder()
                    .setCustomId(AdminQuotaUserHandler.BUTTON_RESET_ID)
                    .setLabel("Reset Quota")
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji("🔄")
            );
        }

        const response = await reply(interaction, {
            ephemeral: true,
            embeds: [
                {
                    title: "User Quota Information",
                    fields: [
                        {
                            name: "Current Quota",
                            value: `${quotaFormat} ${quotaType}`,
                            inline: true,
                        },
                        {
                            name: "Current usage",
                            value: `${usage} (${usagePercent})`,
                            inline: true,
                        },
                    ],
                    color: Colors.Blue,
                },
            ],
            components: [row],
        });

        if (!response) throw new Error("Failed to send message");

        try {
            const buttonInteraction = await response.awaitMessageComponent({
                filter: (i) =>
                    i.user.id === interaction.user.id &&
                    [
                        AdminQuotaUserHandler.BUTTON_SET_ID,
                        AdminQuotaUserHandler.BUTTON_RESET_ID,
                    ].includes(i.customId),
                time: DEFAULT_INTERACTION_WAIT,
            });
            await response.delete();

            if (!buttonInteraction.isButton())
                throw new Error("Expected button interaction");

            await this.handleButtonInteraction(buttonInteraction, userId);
        } catch (e) {
            this.handleError(interaction, e);
        }
    }

    private async handleButtonInteraction(
        interaction: ButtonInteraction,
        userId: string
    ) {
        const { quotaManager } = interaction.client;

        switch (interaction.customId) {
            case AdminQuotaUserHandler.BUTTON_SET_ID:
                await this.showQuotaModal(interaction, userId);
                break;
            case AdminQuotaUserHandler.BUTTON_RESET_ID:
                await quotaManager.deleteUserQuota(userId);
                const quota = await quotaManager.getQuota(userId);
                await reply(interaction, {
                    ephemeral: true,
                    embeds: [
                        {
                            title: "Success",
                            description: `Quota was reset to ${quota}`,
                            color: Colors.Green,
                        },
                    ],
                });
                break;
            default:
                throw new Error(
                    `Unknown button custom id: ${interaction.customId}`
                );
        }
    }

    private async showQuotaModal(
        interaction: ButtonInteraction,
        userId: string
    ) {
        const { quotaManager } = interaction.client;
        const quota =
            (await quotaManager.getUserQuota(userId)) ??
            (await quotaManager.getDefaultQuota());

        const modal = new ModalBuilder()
            .setCustomId(AdminQuotaUserHandler.MODAL_SET_ID)
            .setTitle("Set User Quota")
            .addComponents(
                this.createModalActionRow().addComponents(
                    new TextInputBuilder()
                        .setCustomId(AdminQuotaUserHandler.QUOTA_INPUT_ID)
                        .setLabel("Quota")
                        .setPlaceholder(quota.toString())
                        .setRequired(true)
                        .setMinLength(1)
                        .setMaxLength(10)
                        .setStyle(TextInputStyle.Short)
                        .setValue(quota.toString())
                )
            );

        await interaction.showModal(modal);

        const modalInteraction = await interaction.awaitModalSubmit({
            filter: (i) =>
                i.user.id === interaction.user.id &&
                i.isModalSubmit() &&
                i.customId === AdminQuotaUserHandler.MODAL_SET_ID,
            time: DEFAULT_INTERACTION_WAIT,
        });
        await modalInteraction.deferUpdate();

        const quotaInput = modalInteraction.fields.getTextInputValue(
            AdminQuotaUserHandler.QUOTA_INPUT_ID
        );
        const newQuota = Number(quotaInput);

        if (isNaN(newQuota)) {
            throw new BotException("Quota must be a number");
        }
        if (newQuota < 0) {
            throw new BotException("Quota must be positive");
        }

        await quotaManager.setUserQuota(userId, newQuota);
        await reply(interaction, {
            ephemeral: true,
            embeds: [
                {
                    title: "Success",
                    description: "New quota set successfully!",
                    color: Colors.Green,
                },
            ],
        });
    }

    private handleError(interaction: RepliableInteraction, error: unknown) {
        if (
            error instanceof DiscordjsError &&
            error.code === DiscordjsErrorCodes.InteractionCollectorError
        ) {
            setupInteractionCleanup(interaction, { time: 1 });
        } else if (error instanceof BotException) {
            reply(interaction, {
                ephemeral: true,
                embeds: [
                    {
                        title: "Error",
                        description: error.message,
                        color: Colors.Red,
                    },
                ],
                components: [],
            });
        } else {
            throw error;
        }
    }
}
