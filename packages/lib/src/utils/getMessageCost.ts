import { COST_PER_TOKEN } from "../config/constants.js";
import getMessageSize from "./getMessageSize.js";
import { ConversationMessage } from "./types.js";

/**
 * Returns the cost of a message according to the OpenAI API [pricing page](https://openai.com/pricing#chat).
 *
 * @param message The message to get the cost of.
 * - If it is a string, the size (in tokens) of the message will be calculated first, and then the cost will be calculated.
 * - If it is a number (size in tokens), the cost will be calculated directly from that number.
 * - If it is a [ConversationMessage](./types.ts), the `_cost` property will be returned if it is set. Otherwise, the size (in tokens) of the message will be calculated first, and then the cost will be calculated.
 */
export default (message: string | ConversationMessage | number) => {
    if (typeof message === "number") return message * COST_PER_TOKEN;
    if (typeof message === "object") {
        if (message._cost) return message._cost;
        message._cost = getMessageSize(message) * COST_PER_TOKEN;
        return message._cost;
    }
    return getMessageSize(message) * COST_PER_TOKEN;
};
