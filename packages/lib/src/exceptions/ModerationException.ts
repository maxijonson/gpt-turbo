/**
 * Thrown when a message is flagged by OpenAI's Moderation API.
 *
 * @example
 * ```typescript
 * conversation.addMessage(new Message("user", "Kill them all!")); // This throws a ModerationException (for violence)
 * ```
 */
export class ModerationException extends Error {
    constructor(public flags: string[]) {
        super("This message was flagged by OpenAI's Moderation API."); // Temporary, to satisfy the Error constructor
        this.name = ModerationException.name;
        this.message = `The message was flagged by OpenAI for ${this.flags.join(
            ", "
        )}`;
    }
}
