/**
 * Thrown when the order of the messages role is not alternating between 'user' and 'assistant'.
 *
 * @example
 * ```typescript
 * conversation.addMessage(new Message("user", "Hello!"));
 * conversation.addMessage(new Message("user", "How are you?")); // This throws a MessageRoleException
 * ```
 */
export class MessageRoleException extends Error {
    constructor() {
        super(
            "The order of the messages role must alternate between 'user' and 'assistant'."
        );
        this.name = MessageRoleException.name;
    }
}
