import { Awaitable, Message } from "discord.js";
import BotException from "../exceptions/BotException.js";
import { MessageRoleException, ModerationException } from "gpt-turbo";

/**
 * Base class for handling potential prompt messages in a chain of responsibility.
 *
 * @remarks
 * The goal of this chain of responsibility is to reduce the amount of checks that need to be done to determine if a MessageHandler can/should handle a message. (i.e. a bunch of if statements before actually handling the message properly)
 */
export default abstract class MessageHandler {
    public abstract get name(): string;

    /**
     * The next handler in the chain of responsibility.
     */
    protected next: MessageHandler | null = null;

    /**
     * A sub-handler for this handler. This is used when a handler has multiple ways of handling a message that it can handle.
     */
    protected subHandler: MessageHandler | null = null;

    /**
     * Sets the next handler in the chain of responsibility if this handler cannot handle the message.
     *
     * @param next An instance of a {@link MessageHandler}
     * @returns this
     */
    public setNext(...nextHandlers: MessageHandler[]): this {
        for (const next of nextHandlers) {
            let last: MessageHandler = this;
            while (last.next) {
                last = last.next;
            }
            last.next = next;
        }
        return this;
    }

    /**
     * Determines if this handler can handle the message.
     *
     * @param message The message to handle
     */
    protected abstract canHandle(message: Message): Awaitable<boolean>;

    /**
     * Handles the message. This method is only called if {@link canHandle} returns true, so it is safe to assume that this handler can handle the message.
     * @param message The message to handle
     */
    protected abstract handle(message: Message): Awaitable<void>;

    /**
     * Attempts to handle a message by running through the chain of responsibility.
     *
     * @param message The message to handle
     * @returns The handler that handled the message, or `null` if no handler could handle the message.
     */
    public async handleMessage(
        message: Message
    ): Promise<MessageHandler | null> {
        try {
            if (await this.canHandle(message)) {
                if (this.subHandler) {
                    const subHandler = await this.subHandler.handleMessage(
                        message
                    );
                    if (subHandler) {
                        return subHandler;
                    }
                }
                await this.handle(message);
                return this;
            } else if (this.next) {
                return this.next.handleMessage(message);
            }
            return null;
        } catch (error) {
            if (error instanceof BotException) {
                await message.reply(error.message);
            } else if (error instanceof ModerationException) {
                const flags = error.flags.join(", ");
                await message.reply(
                    `Your message (or the response) was flagged for ${flags}.`
                );
            } else if (error instanceof MessageRoleException) {
                await message.reply(
                    "There was an issue with the order of the messages. This can happen when two replies in a row are sent by a user/assistant."
                );
            } else {
                console.error(error);
                await message.reply(
                    "There was an error while handling your message. Please try again later or start a new conversation."
                );
            }
            return null;
        }
    }
}
