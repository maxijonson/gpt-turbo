import {
    Interaction,
    Awaitable,
    UserSelectMenuInteraction,
    Colors,
} from "discord.js";
import InteractionHandler from "./InteractionHandler.js";
import isBotAdmin from "../utils/isBotAdmin.js";
import getHandlerId from "../utils/getHandlerId.js";

export default class AdminUsageResetUserHandler extends InteractionHandler {
    public static readonly ID = getHandlerId(AdminUsageResetUserHandler.name);

    public get name(): string {
        return AdminUsageResetUserHandler.name;
    }

    protected canHandle(interaction: Interaction): Awaitable<boolean> {
        return (
            isBotAdmin(interaction.user.id) &&
            interaction.isUserSelectMenu() &&
            interaction.customId === AdminUsageResetUserHandler.ID
        );
    }

    protected async handle(
        interaction: UserSelectMenuInteraction
    ): Promise<void> {
        const { quotaManager } = interaction.client;
        const userId = interaction.values[0];
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
