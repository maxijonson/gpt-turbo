import {
    Interaction,
    Awaitable,
    ModalSubmitInteraction,
    Colors,
    DiscordjsError,
    DiscordjsErrorCodes,
    RepliableInteraction,
    ModalBuilder,
    ButtonInteraction,
    TextInputStyle,
    AnySelectMenuInteraction,
    Message,
    InteractionResponse,
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

export default abstract class AdminQuotaSnowflakeHandler extends InteractionHandler {
    public static readonly GENERIC_ID = getHandlerId(
        AdminQuotaSnowflakeHandler.name
    );
    protected static readonly BUTTON_SET_ID = `${AdminQuotaSnowflakeHandler.GENERIC_ID}_button-set`;
    protected static readonly BUTTON_RESET_ID = `${AdminQuotaSnowflakeHandler.GENERIC_ID}_button-reset`;
    protected static readonly MODAL_SET_ID = `${AdminQuotaSnowflakeHandler.GENERIC_ID}_modal-set`;
    protected static readonly QUOTA_INPUT_ID = `${AdminQuotaSnowflakeHandler.GENERIC_ID}_quota-input`;

    constructor(private id: string) {
        super();
    }

    protected canHandle(interaction: Interaction): Awaitable<boolean> {
        return (
            isBotAdmin(interaction.user.id) &&
            (interaction.isAnySelectMenu() || interaction.isModalSubmit()) &&
            interaction.customId === this.id
        );
    }

    protected async handle(
        interaction: AnySelectMenuInteraction | ModalSubmitInteraction
    ): Promise<void> {
        const snowflake = interaction.isModalSubmit()
            ? interaction.fields.getTextInputValue(
                  SnowflakeModalHandler.INPUT_ID
              )
            : interaction.values[0];

        const response = await this.getInitialReply(interaction, snowflake);
        if (!response) throw new Error("Failed to send message");

        try {
            const buttonInteraction = await response.awaitMessageComponent({
                filter: (i) =>
                    i.user.id === interaction.user.id &&
                    [
                        AdminQuotaSnowflakeHandler.BUTTON_SET_ID,
                        AdminQuotaSnowflakeHandler.BUTTON_RESET_ID,
                    ].includes(i.customId),
                time: DEFAULT_INTERACTION_WAIT,
            });
            await response.delete();

            if (!buttonInteraction.isButton())
                throw new Error("Expected button interaction");

            await this.handleButtonInteraction(buttonInteraction, snowflake);
        } catch (e) {
            this.handleError(interaction, e);
        }
    }

    private async handleButtonInteraction(
        interaction: ButtonInteraction,
        snowflake: string
    ) {
        switch (interaction.customId) {
            case AdminQuotaSnowflakeHandler.BUTTON_SET_ID:
                await this.showQuotaModal(interaction, snowflake);
                break;
            case AdminQuotaSnowflakeHandler.BUTTON_RESET_ID:
                await this.deleteQuota(interaction, snowflake);
                const quota = await this.getCurrentQuota(
                    interaction,
                    snowflake
                );
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
        snowflake: string
    ) {
        const quota = await this.getCurrentQuota(interaction, snowflake);

        const modal = new ModalBuilder()
            .setCustomId(AdminQuotaSnowflakeHandler.MODAL_SET_ID)
            .setTitle(this.getModalTitle())
            .addComponents(
                this.createModalActionRow().addComponents(
                    new TextInputBuilder()
                        .setCustomId(AdminQuotaSnowflakeHandler.QUOTA_INPUT_ID)
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
                i.customId === AdminQuotaSnowflakeHandler.MODAL_SET_ID,
            time: DEFAULT_INTERACTION_WAIT,
        });
        await modalInteraction.deferUpdate();

        const quotaInput = modalInteraction.fields.getTextInputValue(
            AdminQuotaSnowflakeHandler.QUOTA_INPUT_ID
        );
        const newQuota = Number(quotaInput);

        if (isNaN(newQuota)) {
            throw new BotException("Quota must be a number");
        }
        if (newQuota < 0) {
            throw new BotException("Quota must be positive");
        }

        await this.setQuota(interaction, snowflake, newQuota);
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

    protected abstract getCurrentQuota(
        interaction: Interaction,
        snowflake: string
    ): Awaitable<number>;

    protected abstract getInitialReply(
        interaction: Interaction,
        snowflake: string
    ): Awaitable<Message<boolean> | InteractionResponse<boolean> | null>;

    protected abstract deleteQuota(
        interaction: Interaction,
        snowflake: string
    ): Awaitable<void>;

    protected abstract getModalTitle(): string;

    protected abstract setQuota(
        interaction: Interaction,
        snowflake: string,
        quota: number
    ): Awaitable<void>;
}
