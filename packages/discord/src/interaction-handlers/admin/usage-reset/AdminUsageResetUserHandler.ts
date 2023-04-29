import {
    Interaction,
    Awaitable,
    UserSelectMenuInteraction,
    Colors,
    ModalSubmitInteraction,
} from "discord.js";
import InteractionHandler from "../../InteractionHandler.js";
import isBotAdmin from "../../../utils/isBotAdmin.js";
import getHandlerId from "../../../utils/getHandlerId.js";
import reply from "../../../utils/reply.js";
import UserIdModalHandler from "../../SnowflakeModalHandler.js";

export default class AdminUsageResetUserHandler extends InteractionHandler {
    public static readonly ID = getHandlerId(AdminUsageResetUserHandler.name);

    public get name(): string {
        return AdminUsageResetUserHandler.name;
    }

    protected canHandle(interaction: Interaction): Awaitable<boolean> {
        return (
            isBotAdmin(interaction.user.id) &&
            (interaction.isUserSelectMenu() || interaction.isModalSubmit()) &&
            interaction.customId === AdminUsageResetUserHandler.ID
        );
    }

    protected async handle(
        interaction: UserSelectMenuInteraction | ModalSubmitInteraction
    ): Promise<void> {
        const { quotaManager } = interaction.client;
        const userId = interaction.isModalSubmit()
            ? interaction.fields.getTextInputValue(UserIdModalHandler.INPUT_ID)
            : interaction.values[0];
        await quotaManager.setUsage(userId, 0);
        await reply(interaction, {
            embeds: [
                {
                    title: "Success",
                    description: `Usage for this user has been reset.`,
                    color: Colors.Green,
                },
            ],
            ephemeral: true,
        });
    }
}
