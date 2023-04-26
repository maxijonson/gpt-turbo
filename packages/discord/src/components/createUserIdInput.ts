import { TextInputBuilder, TextInputStyle } from "discord.js";

export const CREATE_USER_ID_INPUT_ID = "createUserIdInput";

export default () =>
    new TextInputBuilder()
        .setCustomId(CREATE_USER_ID_INPUT_ID)
        .setLabel("Enter the user ID")
        .setPlaceholder("123456789012345678")
        .setMinLength(18)
        .setMaxLength(18)
        .setRequired(true)
        .setStyle(TextInputStyle.Short);
