import {
    ActionRowBuilder,
    Awaitable,
    Colors,
    Interaction,
    MessageActionRowComponentBuilder,
    ModalActionRowComponentBuilder,
} from "discord.js";
import BotException from "../exceptions/BotException.js";
import { COOLDOWN_MESSAGE } from "../config/constants.js";
import reply from "../utils/reply.js";

/**
 * Base class for handling potential prompt interactions in a chain of responsibility.
 */
export default abstract class InteractionHandler {
    public abstract get name(): string;

    /**
     * The next handler in the chain of responsibility.
     */
    protected next: InteractionHandler | null = null;

    /**
     * A sub-handler for this handler. This is used when a handler has multiple ways of handling a interaction that it can handle.
     */
    protected subHandler: InteractionHandler | null = null;

    /**
     * Sets the next handler in the chain of responsibility if this handler cannot handle the interaction.
     *
     * @param next An instance of a {@link InteractionHandler}
     * @returns this
     */
    public setNext(...nextHandlers: InteractionHandler[]): this {
        for (const next of nextHandlers) {
            let last: InteractionHandler = this;
            while (last.next) {
                last = last.next;
            }
            last.next = next;
        }
        return this;
    }

    /**
     * Determines if this handler can handle the interaction.
     *
     * @param interaction The interaction to handle
     */
    protected abstract canHandle(interaction: Interaction): Awaitable<boolean>;

    /**
     * Handles the interaction. This method is only called if {@link canHandle} returns true, so it is safe to assume that this handler can handle the interaction.
     * @param interaction The interaction to handle
     */
    protected abstract handle(interaction: Interaction): Awaitable<void>;

    /**
     * Attempts to handle a interaction by running through the chain of responsibility.
     *
     * @param interaction The interaction to handle
     * @returns The handler that handled the interaction, or `null` if no handler could handle the interaction.
     */
    public async handleInteraction(
        interaction: Interaction,
        isSubHandler = false
    ): Promise<InteractionHandler | null> {
        try {
            if (await this.canHandle(interaction)) {
                if (
                    !isSubHandler &&
                    interaction.client.isOnCooldown(
                        interaction.user.id,
                        "interaction",
                        500
                    )
                ) {
                    await reply(interaction, {
                        content: COOLDOWN_MESSAGE,
                        ephemeral: true,
                    });
                    return null;
                }
                if (this.subHandler) {
                    const subHandler = await this.subHandler.handleInteraction(
                        interaction,
                        true
                    );
                    if (subHandler) {
                        return subHandler;
                    }
                }
                await this.handle(interaction);
                return this;
            } else if (this.next) {
                return this.next.handleInteraction(interaction);
            }
            return null;
        } catch (error) {
            let content = "There was an error while handling this interaction!";

            if (error instanceof BotException) {
                content = error.message;
            } else {
                console.error(error);
            }

            await reply(interaction, {
                embeds: [
                    {
                        title: "Error",
                        description: content,
                        color: Colors.Red,
                    },
                ],
                ephemeral: true,
            });
            return this;
        }
    }

    protected createMessageActionRow() {
        return new ActionRowBuilder<MessageActionRowComponentBuilder>();
    }

    protected createModalActionRow() {
        return new ActionRowBuilder<ModalActionRowComponentBuilder>();
    }
}
