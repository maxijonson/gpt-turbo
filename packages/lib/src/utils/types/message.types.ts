import { Message } from "../../classes/Message.js";

/**
 * Supported values for the `role` property of a message.
 */
export type ChatCompletionRequestMessageRoleEnum =
    | "user"
    | "system"
    | "assistant"
    | "function";

/**
 * Listener for when a {@link Message} is added to a conversation.
 */
export type AddMessageListener = (
    /**
     * The {@link Message message} that was added
     */
    message: Message
) => void;

/**
 * Listener for when a {@link Message} is removed from a conversation.
 */
export type RemoveMessageListener = (
    /**
     * The {@link Message message} that was removed
     */
    message: Message
) => void;

/**
 * A message in OpenAI's chat format.
 *
 * @see {@link https://platform.openai.com/docs/api-reference/chat/create#chat/create-messages Create Chat Completion Request Body - messages}
 */
export interface CreateChatCompletionMessage {
    /**
     * The message role.
     *
     * @see {@link ChatCompletionRequestMessageRoleEnum}
     */
    role: Exclude<ChatCompletionRequestMessageRoleEnum, "function">;

    /**
     * The message content.
     */
    content: string;

    function_call?: undefined;
    name?: undefined;
}

export type CompletionMessage = Message & {
    role: Exclude<ChatCompletionRequestMessageRoleEnum, "function">;
    content: string;
    functionCall: undefined;
    name: undefined;
};

/**
 * A function_call-related message in OpenAI's chat format.
 *
 * @see {@link https://platform.openai.com/docs/api-reference/chat/create#chat/create-messages Create Chat Completion Request Body - messages}
 */
export interface CreateChatCompletionFunctionCallMessage {
    role: Extract<ChatCompletionRequestMessageRoleEnum, "assistant">;
    content: null;
    function_call: {
        name: string;
        arguments: string;
    };

    name?: undefined;
}

export type FunctionCallMessage = Message & {
    role: "assistant";
    content: null;
    functionCall: {
        name: string;
        arguments: Record<string, any>;
    };
};

/**
 * A function-related message in OpenAI's chat format.
 *
 * @see {@link https://platform.openai.com/docs/api-reference/chat/create#chat/create-messages Create Chat Completion Request Body - messages}
 */
export interface CreateChatCompletionFunctionMessage {
    role: Extract<ChatCompletionRequestMessageRoleEnum, "function">;
    content: string;
    name: string;

    function_call?: undefined;
}

export type FunctionMessage = Message & {
    role: "function";
    name: string;
    content: string;
};

/**
 * Request body for a Create Moderation request, which classifies if text violates OpenAI's Content Policy.
 *
 * Endpoint: `POST https://api.openai.com/v1/moderations`
 *
 * @see {@link https://platform.openai.com/docs/api-reference/moderations/create Create Moderation Request Body}
 */
export interface CreateModerationRequest {
    /**
     * Your OpenAI API key.
     */
    apiKey: string;

    /**
     * The text to classify.
     */
    input: string;
}

/**
 * Response body for a {@link CreateModerationRequest Create Moderation Request}.
 */
export interface CreateModerationResponse {
    /**
     * The ID of the request.
     */
    id: string;

    /**
     * The moderation model used to classify the text.
     */
    model: string;

    /**
     * The classification results.
     */
    results: [
        {
            /**
             * Contains a dictionary of per-category binary usage policies violation flags.
             * For each category, the value is `true` if the model flags the corresponding category as violated, `false` otherwise.
             *
             * @see {@link https://platform.openai.com/docs/guides/moderation/overview Moderation Categories}
             */
            categories: {
                hate: boolean;
                "hate/threatening": boolean;
                harassment: boolean;
                "harassment/threatening": boolean;
                "self-harm": boolean;
                "self-harm/intent": boolean;
                "self-harm/instructions": boolean;
                sexual: boolean;
                "sexual/minors": boolean;
                violence: boolean;
                "violence/graphic": boolean;
            };

            /**
             * Contains a dictionary of per-category raw scores output by the model, denoting the model's confidence that the input violates the OpenAI's policy for the category.
             * The value is between 0 and 1, where higher values denote higher confidence. The scores should not be interpreted as probabilities.
             *
             * @see {@link https://platform.openai.com/docs/guides/moderation/overview Moderation Categories}
             */
            category_scores: {
                hate: number;
                "hate/threatening": number;
                harassment: number;
                "harassment/threatening": number;
                "self-harm": number;
                "self-harm/intent": number;
                "self-harm/instructions": number;
                sexual: number;
                "sexual/minors": number;
                violence: number;
                "violence/graphic": number;
            };

            /**
             * Set to `true` if the model classifies the content as violating OpenAI's usage policies, `false` otherwise.
             */
            flagged: boolean;
        }
    ];
}

/**
 * Listener for when a {@link Message message}'s content is updated.
 */
export type MessageUpdateListener = (
    /**
     * The new content of the message.
     */
    content: string | null,

    /**
     * The {@link Message message} instance that was updated.
     */
    message: Message
) => void;

/**
 * Listener for when a {@link Message message}'s streaming state is updated.
 */
export type MessageStreamingListener = (
    /**
     * The new streaming state of the message.
     */
    isStreaming: boolean,

    /**
     * The {@link Message message} instance that was updated.
     */
    message: Message
) => void;

/**
 * Listener for when a {@link Message message} starts streaming.
 */
export type MessageStreamingStartListener = (
    /**
     * The {@link Message message} instance that started streaming.
     */
    message: Message
) => void;

/**
 * Listener for when a {@link Message message} stops streaming.
 */
export type MessageStreamingStopListener = (
    /**
     * The {@link Message message} instance that stopped streaming.
     */
    message: Message
) => void;

export type MessageContentStreamListener = (
    /**
     * The new content of the message.
     */
    content: string | null,

    /**
     * The new streaming state of the message.
     */
    isStreaming: boolean,

    /**
     * The {@link Message message} instance that was updated during streaming.
     */
    message: Message
) => void;
