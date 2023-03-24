export class MessageRoleException extends Error {
    constructor() {
        super(
            "The order of the messages role must alternate between 'user' and 'assistant'."
        );
        this.name = MessageRoleException.name;
    }
}
