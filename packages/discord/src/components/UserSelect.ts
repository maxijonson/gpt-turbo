import { UserSelectMenuBuilder } from "discord.js";
import getHandlerId from "../utils/getHandlerId.js";

export default class UserSelect extends UserSelectMenuBuilder {
    public static readonly GENERIC_ID = getHandlerId(UserSelect.name);

    constructor(id: string) {
        super();
        this.setCustomId(id)
            .setPlaceholder("Select a user")
            .setMinValues(1)
            .setMaxValues(1);
    }
}
