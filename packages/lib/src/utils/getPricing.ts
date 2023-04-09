import { PRICING_TABLE } from "../config/constants.js";

/**
 * Returns the pricing model for a given `model`.
 *
 * @param model The chat completion model to get the pricing model for.
 */
export default (model: string) => {
    if (!model) return PRICING_TABLE["unknown"];
    if (model.startsWith("gpt-3.5")) return PRICING_TABLE["3.5"];
    if (model.startsWith("gpt-4-32k")) return PRICING_TABLE["4-32k"];
    if (model.startsWith("gpt-4")) return PRICING_TABLE["4"];
    return PRICING_TABLE["unknown"];
};
