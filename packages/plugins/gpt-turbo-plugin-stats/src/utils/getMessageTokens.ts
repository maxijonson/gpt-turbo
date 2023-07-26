import { encode } from "gpt-tokenizer";

/**
 * Returns an array of tokens from a given `message`.
 *
 * @param message The message to get the tokens from.
 */
export default (message: string) => {
    return encode(message);
};
