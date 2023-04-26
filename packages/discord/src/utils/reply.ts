import { Interaction, InteractionReplyOptions } from "discord.js";

export default (
    interaction: Interaction,
    options: InteractionReplyOptions | string
) => {
    if (!interaction.isRepliable()) return null;

    if (interaction.replied) {
        return interaction.followUp(options);
    }

    if (interaction.deferred) {
        return interaction.editReply(options);
    }

    return interaction.reply(options);
};
