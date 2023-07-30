import {
    Interaction,
    Awaitable,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
} from "discord.js";
import InteractionHandler from "./InteractionHandler.js";
import isBotAdmin from "../utils/isBotAdmin.js";
import getHandlerId from "../utils/getHandlerId.js";

export default class SnowflakeModalHandler extends InteractionHandler {
    public static readonly GENERIC_ID = getHandlerId(
        SnowflakeModalHandler.name
    );
    public static readonly INPUT_ID = `${SnowflakeModalHandler.GENERIC_ID}_input`;

    constructor(
        private id: string,
        private forwardId: string,
        private title = "Enter ID",
        private label = "ID"
    ) {
        super();
    }

    public get name(): string {
        return SnowflakeModalHandler.name;
    }

    protected canHandle(interaction: Interaction): Awaitable<boolean> {
        return (
            isBotAdmin(interaction.user.id) &&
            interaction.isMessageComponent() &&
            interaction.customId === this.id
        );
    }

    protected async handle(interaction: Interaction): Promise<void> {
        if (!interaction.isMessageComponent())
            throw new Error("Invalid interaction type");

        const modal = new ModalBuilder()
            .setCustomId(this.forwardId)
            .setTitle(this.title)
            .addComponents(
                this.createModalActionRow().addComponents(
                    new TextInputBuilder()
                        .setCustomId(SnowflakeModalHandler.INPUT_ID)
                        .setLabel(this.label)
                        .setPlaceholder("123456789012345678")
                        .setMinLength(18)
                        .setMaxLength(18)
                        .setRequired(true)
                        .setStyle(TextInputStyle.Short)
                )
            );

        await interaction.showModal(modal);
    }
}
