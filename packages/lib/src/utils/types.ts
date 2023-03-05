import { ChatCompletionRequestMessage } from "openai";

export type ChatCompletionModel = "gpt-3.5-turbo" | "gpt-3.5-turbo-0301";

export type ConversationMessage = ChatCompletionRequestMessage & {
    /**
     * The size of the message content in tokens.
     *
     * **Do not use this property as it is only set internally whenever the size of the message is calculated.
     * Instead, use the `getMessageSize` function exported from the package.**
     */
    _size?: number;

    /**
     * The cost of the message content in tokens.
     *
     * **Do not use this property as it is only set internally whenever the cost of the message is calculated.
     * Instead, use the `getMessageCost` function exported from the package.**
     */
    _cost?: number;
};
