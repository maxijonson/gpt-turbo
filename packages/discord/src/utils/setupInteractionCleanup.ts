import { Colors, Interaction } from "discord.js";

/**
 * Sets up a collector to automatically delete the interaction after it either interacted with or after it expires.
 *
 * @param interaction The interaction to set up the collector for.
 * @param time The time in milliseconds after which the interaction should expire.
 */
export default (interaction: Interaction, time = 60_000) => {
    const collector = interaction.channel?.createMessageComponentCollector({
        filter: (i) => {
            // Only collect messages from the user who initiated the interaction
            if (i.user.id !== interaction.user.id) return false;

            // Probably a ChatInputCommand
            if (!interaction.isMessageComponent()) {
                return i.message.interaction?.id === interaction.id;
            }

            // Check if the message is a reply to the interaction
            return i.message.reference?.messageId === interaction.message.id;
        },
        time,
    });

    if (!collector) return;

    collector.once("collect", () => {
        if (interaction.isRepliable()) {
            interaction.deleteReply();
        }
        collector.stop();
    });

    collector.once("end", (collected) => {
        if (collected.size || !interaction.isRepliable()) return;
        setTimeout(() => {
            interaction.deleteReply();
        }, 10_000);

        interaction.editReply({
            content: "",
            embeds: [
                {
                    title: "Interaction expired",
                    description:
                        "You did not perform an action in time. Please try again.",
                    color: Colors.Yellow,
                },
            ],
            components: [],
        });
    });
};
