import { RoleSelectMenuBuilder } from "discord.js";
import getHandlerId from "../utils/getHandlerId.js";

export default class RoleSelect extends RoleSelectMenuBuilder {
    public static readonly GENERIC_ID = getHandlerId(RoleSelect.name);

    constructor(id: string) {
        super();
        this.setCustomId(id)
            .setPlaceholder("Select a role")
            .setMinValues(1)
            .setMaxValues(1);
    }
}
