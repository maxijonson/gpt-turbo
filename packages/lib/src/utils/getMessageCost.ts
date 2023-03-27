import getMessageSize from "./getMessageSize.js";

const pricing = {
    unknown: {
        prompt: 0,
        completion: 0,
    },
    "3.5": {
        prompt: 0.000002,
        completion: 0.000002,
    },
    "4": {
        prompt: 0.00003,
        completion: 0.00006,
    },
    "4-32k": {
        prompt: 0.00006,
        completion: 0.00012,
    },
};

const getPricing = (model: string) => {
    if (!model) return pricing["unknown"];
    if (model.startsWith("gpt-3.5")) return pricing["3.5"];
    if (model.startsWith("gpt-4-32k")) return pricing["4-32k"];
    if (model.startsWith("gpt-4")) return pricing["4"];
    return pricing["unknown"];
};

/**
 * Returns the cost of a message according to the OpenAI API [pricing page](https://openai.com/pricing#chat).
 *
 * @param message The message to get the cost of.
 * - If it is a string, the size (in tokens) of the message will be calculated first, and then the cost will be calculated.
 * - If it is a number (size in tokens), the cost will be calculated directly from that number.
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
