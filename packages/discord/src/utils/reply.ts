import { Interaction, InteractionReplyOptions } from "discord.js";

/**
 * Convenience method for replying to an interaction without having to check if it's deferred or replied.
 *
 * @param interaction The interaction to reply to.
 * @param options The options to reply with, or the content to reply with if this is a string.
 * @returns The interaction reply promise or `null` if the interaction is not repliable.
 */
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
