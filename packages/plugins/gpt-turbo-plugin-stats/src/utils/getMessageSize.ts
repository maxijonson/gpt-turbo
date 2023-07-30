import { encode } from "gpt-tokenizer";

/**
 * Returns the size of a message in tokens.
 *
 * @param message The message to get the size of.
 */
export default (message: string) => {
    return encode(message).length;
};
