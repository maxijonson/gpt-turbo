import { encode } from "gpt-3-encoder";
import { ConversationMessage } from "./types";

/**
 * Returns the size of a message in tokens.
 *
 * @param message The message to get the size of.
 * - If it is a string, the size (in tokens) of the message will be calculated directly from that string.
 * - If it is a [ConversationMessage](./types.ts), the `_size` property will be returned if it is set. Otherwise, the size (in tokens) of the message will be calculated first, and then the cost will be calculated.
 */
export default (message: string | ConversationMessage) => {
    if (typeof message === "object") {
        if (message._size) return message._size;
        message._size = encode(message.content).length;
        return message._size;
    }
    return encode(message).length;
};
