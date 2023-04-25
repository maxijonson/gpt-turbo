import {
    Interaction,
    Awaitable,
    ModalSubmitInteraction,
    Colors,
} from "discord.js";
import InteractionHandler from "./InteractionHandler.js";
import isBotAdmin from "../utils/isBotAdmin.js";
import getHandlerId from "../utils/getHandlerId.js";

export default class AdminUsageResetUserIdHandler extends InteractionHandler {
    public static readonly ID = getHandlerId(AdminUsageResetUserIdHandler.name);

    public get name(): string {
        return AdminUsageResetUserIdHandler.name;
    }

    protected canHandle(interaction: Interaction): Awaitable<boolean> {
        return (
            isBotAdmin(interaction.user.id) &&
            interaction.isModalSubmit() &&
            interaction.customId === AdminUsageResetUserIdHandler.ID
        );
    }

    protected async handle(interaction: ModalSubmitInteraction): Promise<void> {
        const { quotaManager } = interaction.client;
        const { fields } = interaction;

        const userId = fields.getTextInputValue("userId");
        await quotaManager.setUsage(userId, 0);
        await interaction.reply({
            embeds: [
                {
                    title: "Success",
                    description: `All usages for this user have been reset.`,
                    color: Colors.Green,
                },
            ],
            ephemeral: true,
        });
    }
}
