import { Interaction, Awaitable, ButtonInteraction, Colors } from "discord.js";
import InteractionHandler from "./InteractionHandler.js";
import isBotAdmin from "../utils/isBotAdmin.js";
import getHandlerId from "../utils/getHandlerId.js";
import reply from "../utils/reply.js";

export default class AdminUsageResetAllHandler extends InteractionHandler {
    public static readonly ID = getHandlerId(AdminUsageResetAllHandler.name);

    public get name(): string {
        return AdminUsageResetAllHandler.name;
    }

    protected canHandle(interaction: Interaction): Awaitable<boolean> {
        return (
            isBotAdmin(interaction.user.id) &&
            interaction.isButton() &&
            interaction.customId === AdminUsageResetAllHandler.ID
        );
    }

    protected async handle(interaction: ButtonInteraction): Promise<void> {
        const { quotaManager } = interaction.client;
        await quotaManager.clearAllUsages();
        await reply(interaction, {
            embeds: [
                {
                    title: "Success",
                    description: "All usages have been reset.",
                    color: Colors.Green,
                },
            ],
            ephemeral: true,
        });
    }
}
