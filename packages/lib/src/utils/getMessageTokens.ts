import { encode } from "gpt-token-utils";

/**
 * Returns an array of tokens from a given `message`.
 *
 * @param message The message to get the tokens from.
 */
export default (message: string): string[] => {
    return encode(message).matchedTextSegments;
};
