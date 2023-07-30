import getMessageSize from "./getMessageSize.js";
import getPricing from "./getPricing.js";

/**
 * Returns the cost of a message according to the OpenAI API [pricing page](https://openai.com/pricing#chat).
 *
 * @param message The message to get the cost of. Either a string or a number of tokens.
 * @param model The model to use for the calculation. See list: https://platform.openai.com/docs/models/model-endpoint-compatibility
 * @param type The type of message to calculate the cost of. Either "prompt" or "completion".
 */
export default (
    message: string | number,
    model: string,
    type: "prompt" | "completion"
) => {
    const price = getPricing(model)[type];
    if (typeof message === "number") return message * price;
    return getMessageSize(message) * price;
};
