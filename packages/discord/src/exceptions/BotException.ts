/**
 * Use this class when throwing errors where the error message is meant to be sent to the user.
 */
export default class BotException extends Error {
    constructor(message?: string, options?: ErrorOptions) {
        super(message, options);
    }
}
