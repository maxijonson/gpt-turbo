import { Colors, DiscordAPIError, Interaction } from "discord.js";
import { DEFAULT_INTERACTION_WAIT } from "../config/constants.js";

/**
 * Sets up a collector to automatically delete the interaction after it either interacted with or after it expires.
 *
 * @param interaction The interaction to set up the collector for.
 * @param time The time in milliseconds after which the interaction should expire.
 */
export default (
    interaction: Interaction,
    options: { time?: number; showError?: boolean } = {}
) => {
    const { time = DEFAULT_INTERACTION_WAIT, showError = true } = options;
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

    collector.once("end", async (collected) => {
        if (collected.size || !interaction.isRepliable()) return;
        if (!showError) return interaction.deleteReply();

        setTimeout(async () => {
            try {
                await interaction.deleteReply();
            } catch (e) {
                // Unknown Message (probably deleted)
                if (e instanceof DiscordAPIError && e.code === 10008) {
                    return;
                }
                throw e;
            }
        }, 10_000);

        try {
            await interaction.editReply({
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
        } catch (e) {
            // Unknown Message (probably deleted)
            if (e instanceof DiscordAPIError && e.code === 10008) {
                return;
            }
            throw e;
        }
    });
};
