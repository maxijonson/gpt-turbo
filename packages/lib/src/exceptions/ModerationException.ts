export class ModerationException extends Error {
    constructor(public flags: string[]) {
        super("This message was flagged by OpenAI's Moderation API."); // Temporary, to satisfy the Error constructor
        this.name = ModerationException.name;
        this.message = `The following categories were flagged for violating OpenAI's usage policies: ${this.flags.join(
            ", "
        )}`;
    }
}
