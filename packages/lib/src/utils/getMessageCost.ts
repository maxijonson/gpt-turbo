import { COST_PER_TOKEN } from "../config/constants.js";
import getMessageSize from "./getMessageSize.js";

/**
 * Returns the cost of a message according to the OpenAI API [pricing page](https://openai.com/pricing#chat).
 *
 * @param message The message to get the cost of.
 * - If it is a string, the size (in tokens) of the message will be calculated first, and then the cost will be calculated.
 * - If it is a number (size in tokens), the cost will be calculated directly from that number.
 */
export default (message: string | number) => {
    if (typeof message === "number") return message * COST_PER_TOKEN;
    return getMessageSize(message) * COST_PER_TOKEN;
};
