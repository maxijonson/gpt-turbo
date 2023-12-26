export interface ChatCompletionResponseMessageLogprobContentLogprob {
    /**
     * The token.
     */
    token: string;

    /**
     * The log probability of this token.
     */
    logprob: number;

    /**
     * A list of integers representing the UTF-8 bytes representation of the token.
     * Useful in instances where characters are represented by multiple tokens and their byte representations must be combined to generate the correct text representation.
     * Can be null if there is no bytes representation for the token.
     */
    bytes: number[] | null;
}

export type ChatCompletionResponseMessageLogprobContent =
    ChatCompletionResponseMessageLogprobContentLogprob & {
        /**
         * List of the most likely tokens and their log probability, at this token position.
         * In rare cases, there may be fewer than the number of requested top_logprobs returned.
         */
        top_logprobs: ChatCompletionResponseMessageLogprobContentLogprob[];
    };

/**
 * Log probability information for the choice.
 */
export interface ChatCompletionResponseMessageLogprob {
    /**
     * A list of message content tokens with log probability information.
     */
    content: ChatCompletionResponseMessageLogprobContent[] | null;
}
