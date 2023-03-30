import GPT3Tokenizer from "gpt3-tokenizer";

const tokenizer = new GPT3Tokenizer.default({ type: "gpt3" });

/**
 * Returns the size of a message in tokens.
 *
 * @param message The message to get the size of.
 */
export default (message: string) => {
    return tokenizer.encode(message).bpe.length;
};
