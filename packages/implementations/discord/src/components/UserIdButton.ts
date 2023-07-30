import { ButtonBuilder, ButtonStyle } from "discord.js";
import getHandlerId from "../utils/getHandlerId.js";

export default class UserIdButton extends ButtonBuilder {
    public static readonly GENERIC_ID = getHandlerId(UserIdButton.name);

    constructor(id: string) {
        super();
        this.setCustomId(id)
            .setLabel("Enter User ID")
            .setEmoji("🆔")
            .setStyle(ButtonStyle.Secondary);
    }
}
