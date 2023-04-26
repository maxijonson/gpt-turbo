import { Interaction, InteractionReplyOptions } from "discord.js";

export default (
    interaction: Interaction,
    replyOptions: (InteractionReplyOptions & { edit?: boolean }) | string
) => {
    const { edit = false, ...options } =
        typeof replyOptions === "string"
            ? { content: replyOptions }
            : replyOptions;
    if (!interaction.isRepliable()) return null;
    return interaction.deferred || interaction.replied
        ? edit
            ? interaction.editReply(options)
            : interaction.followUp(options)
        : interaction.reply(options);
};
