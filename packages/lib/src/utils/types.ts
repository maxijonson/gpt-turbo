/* eslint-disable @typescript-eslint/no-unused-vars */
import { Conversation } from "../classes/Conversation.js";
import { ConversationConfig } from "../classes/ConversationConfig.js";
import { Message } from "../classes/Message.js";

/**
 * Supported values for the `role` property of a message.
 */
export type ChatCompletionRequestMessageRoleEnum =
    | "user"
    | "system"
    | "assistant";

/**
 * Overridable {@link CreateChatCompletionRequest} properties of a {@link Conversation}'s config for a single prompt.
 */
export type PromptOptions = Omit<
    CreateChatCompletionRequest,
    "model" | "messages" | "apiKey"
>;

/**
 * Overridable {@link CreateChatCompletionRequest} properties of a {@link Conversation}'s config for a chat completion.
 */
export type HandleChatCompletionOptions = Omit<PromptOptions, "stream">;

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
 * Proxy configuration to use for requests to the OpenAI API.
 */
export interface RequestOptionsProxy {
    /**
     * The hostname or IP address of the proxy server.
     *
     * @example "proxy.example.com"
     * @example "127.0.0.1"
     */
    host: string;

    /**
     * The port number of the proxy server.
     *
     * @default 80 for HTTP, 443 for HTTPS
     */
    port?: number;

    /**
     * The HTTP protocol used by the proxy server.
     */
    protocol?: "http" | "https";

    /**
     * **HTTP Basic** credentials for the proxy server.
     *
     * @remarks
     * The `Proxy-Authorization` header will be added with the Base64 encoded value of `username:password`: `Proxy-Authorization: Basic ${base64(username:password)}`
     */
    auth?: {
        /**
         * The username to use for authentication.
         */
        username: string;

        /**
         * The password to use for authentication.
         */
        password: string;
    };
}

/**
 * Headers and proxy configuration to use for requests to the OpenAI API.
 */
export interface RequestOptions {
    /**
     * Additional headers to send with the request.
     *
     * @remarks
     * Note that the `Content-Type`, `Authorization` and `Proxy-Authorization` headers are ignored, as they are set by the library itself.
     */
    headers?: Record<string, string>;

    /**
     * Proxy configuration to use for the request.
     *
     * @remarks
     * Example resulting request url with a proxy:\
     * `https://my.proxy.com:1337/https://api.openai.com/v1/chat/completions`
     */
    proxy?: RequestOptionsProxy;
}

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
    role: ChatCompletionRequestMessageRoleEnum;

    /**
     * The message content.
     */
    content: string;
}

/**
 * Request body for a Create Chat Completion request, which creates a completion for the conversation's messages.
 *
 * Endpoint: `POST https://api.openai.com/v1/chat/completions`
 *
 * @remarks
 * The `apiKey` property is not part of the request body, but is instead used to set the `Authorization` header. \
 * The `n` property is not part of the request body, because only 1 chat completion choices is supported by the library.
 *
 * @see {@link https://platform.openai.com/docs/api-reference/chat/create Create Chat Completion Request Body}
 */
export interface CreateChatCompletionRequest {
    /**
     * Your OpenAI API key.
     */
    apiKey: string;

    /**
     * ID of the model to use. See the {@link https://platform.openai.com/docs/models/model-endpoint-compatibility model endpoint compatibility} table for details on which models work with the Chat API.
     *
     * @see {@link https://platform.openai.com/docs/api-reference/chat/create#chat/create-model Create Chat Completion Request Body - model}
     */
    model: string;

    /**
     * The messages to generate chat completions for, in the {@link https://platform.openai.com/docs/guides/chat/introduction chat format}.
     *
     * @see {@link https://platform.openai.com/docs/api-reference/chat/create#chat/create-messages Create Chat Completion Request Body - messages}
     */
    messages: CreateChatCompletionMessage[];

    /**
     * What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.
     *
     * We generally recommend altering this or {@link CreateChatCompletionRequest.top_p `top_p`} but not both.
     *
     * @default 1
     * @see {@link https://platform.openai.com/docs/api-reference/chat/create#chat/create-temperature Create Chat Completion Request Body - temperature}
     */
    temperature?: number;

    /**
     * An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered.
     *
     * We generally recommend altering this or {@link CreateChatCompletionRequest.temperature `temperature`} but not both.
     *
     * @default 1
     * @see {@link https://platform.openai.com/docs/api-reference/chat/create#chat/create-top_p Create Chat Completion Request Body - top_p}
     */
    top_p?: number;

    /**
     * If set, partial message deltas will be sent, like in ChatGPT. Tokens will be sent as data-only {@link https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format server-sent events} as they become available, with the stream terminated by a `data: [DONE]` message.
     * See the OpenAI Cookbook for {@link https://github.com/openai/openai-cookbook/blob/main/examples/How_to_stream_completions.ipynb example code}.
     *
     * @default false
     * @see {@link https://platform.openai.com/docs/api-reference/chat/create#chat/create-stream Create Chat Completion Request Body - stream}
     */
    stream?: boolean;

    /**
     * Up to 4 sequences where the API will stop generating further tokens.
     *
     * @default null
     * @see {@link https://platform.openai.com/docs/api-reference/chat/create#chat/create-stop Create Chat Completion Request Body - stop}
     */
    stop?: string | string[] | null;

    /**
     * The maximum number of {@link https://platform.openai.com/tokenizer tokens} to generate in the chat completion.
     *
     * The total length of input tokens and generated tokens is limited by the model's context length.
     *
     * @default inf
     * @see {@link https://platform.openai.com/docs/api-reference/chat/create#chat/create-max_tokens Create Chat Completion Request Body - max_tokens}
     */
    max_tokens?: number;

    /**
     * Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
     *
     * {@link https://platform.openai.com/docs/api-reference/parameter-details See more information about frequency and presence penalties.}
     *
     * @default 0
     * @see {@link https://platform.openai.com/docs/api-reference/chat/create#chat/create-presence_penalty Create Chat Completion Request Body - presence_penalty}
     */
    presence_penalty?: number;

    /**
     * Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
     *
     * {@link https://platform.openai.com/docs/api-reference/parameter-details See more information about frequency and presence penalties.}
     *
     * @default 0
     * @see {@link https://platform.openai.com/docs/api-reference/chat/create#chat/create-frequency_penalty Create Chat Completion Request Body - frequency_penalty}
     */
    frequency_penalty?: number;

    /**
     * Modify the likelihood of specified tokens appearing in the completion.
     *
     * Accepts a json object that maps tokens (specified by their token ID in the tokenizer) to an associated bias value from -100 to 100. Mathematically, the bias is added to the logits generated by the model prior to sampling. The exact effect will vary per model, but values between -1 and 1 should decrease or increase likelihood of selection; values like -100 or 100 should result in a ban or exclusive selection of the relevant token.
     *
     * @default null
     * @see {@link https://platform.openai.com/docs/api-reference/chat/create#chat/create-logit_bias Create Chat Completion Request Body - logit_bias}
     */
    logit_bias?: {
        [token: number]: number;
    };

    /**
     * A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse. {@link https://platform.openai.com/docs/guides/safety-best-practices/end-user-ids Learn more}.
     *
     * @see {@link https://platform.openai.com/docs/api-reference/chat/create#chat/create-user Create Chat Completion Request Body - user}
     */
    user?: string;
}

/**
 * The response body for a {@link CreateChatCompletionRequest Create Chat Completion request}.
 *
 * @see {@link https://platform.openai.com/docs/guides/chat/response-format Chat Completion Response Body}
 */
export interface CreateChatCompletionResponse {
    /**
     * A unique identifier for the chat completion.
     */
    id: string;

    /**
     * The object type, which is always `chat_completion`.
     */
    object: string;

    /**
     * The time the chat completion was created, in Unix time.
     */
    created: number;

    /**
     * The model used to generate the chat completion.
     */
    model: string;

    /**
     * The usage incurred by the chat completion.
     */
    usage: {
        /**
         * The number of tokens used for the prompt.
         */
        prompt_tokens: number;

        /**
         * The number of tokens used for the completion.
         */
        completion_tokens: number;

        /**
         * The sum of the prompt and completion tokens.
         */
        total_tokens: number;
    };

    /**
     * The chat completion choices generated by the model. Always contains exactly one choice.
     */
    choices: [
        {
            /**
             * The assistant's response to the prompt.
             */
            message: CreateChatCompletionMessage;

            /**
             * The reason the chat completion ended. Always "stop" for non-streamed completions.
             */
            finish_reason: string;

            /**
             * The index of the choice in the request. Always 0.
             */
            index: number;
        }
    ];
}

/**
 * The response body for a single chunk generated by the {@link CreateChatCompletionRequest Create Chat Completion request} request with `stream` set to `true`.
 */
export interface CreateChatCompletionStreamResponse {
    /**
     * A unique identifier for the chat completion.
     */
    id: string;

    /**
     * The object type, which is always `chat_completion`.
     */
    object: string;

    /**
     * The time the chat completion was created, in Unix time.
     */
    created: number;

    /**
     * The model used to generate the chat completion.
     */
    model: string;

    /**
     * The chat completion choices generated by the model. Always contains exactly one choice.
     */
    choices: [
        {
            /**
             * A token representing part of the assistant's response to the prompt.
             */
            delta: CreateChatCompletionMessage;

            /**
             * The reason the chat completion ended. `null` when streaming, otherwise "stop".
             */
            finish_reason: string | null;

            /**
             * The index of the choice in the request. Always 0.
             */
            index: number;
        }
    ];
}

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
                "self-harm": boolean;
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
                "self-harm": number;
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
 * Configuration options for streamed Chat Completions executed in dry mode.
 */
export interface CreateDryChatCompletionConfig {
    /**
     * The model to use for the completion.
     *
     * @default "gpt-3.5-turbo"
     */
    model?: string;

    /**
     * The delay before the first chunk is sent.
     *
     * @default 500
     */
    initialDelay?: number;

    /**
     * The delay between each chunk.
     *
     * @default 50
     */
    chunkDelay?: number;
}

/**
 * Default values for OpenAI's Chat Completion API supported by the {@link ConversationConfig} class.
 */
export type ConversationConfigChatCompletionOptions = Omit<
    Partial<CreateChatCompletionRequest>,
    "messages"
>;

/**
 * Library specific configuration options for the {@link Conversation} class, used by the {@link ConversationConfig} class.
 */
export interface ConversationConfigOptions {
    /**
     * The first system message to set the context for the GPT model.
     *
     * @default "You are a large language model trained by OpenAI. Answer as concisely as possible."
     */
    context?: string;

    /**
     * Dry run. Don't send any requests to OpenAI. Responses will mirror the last message in the conversation.
     *
     * @default false
     */
    dry?: boolean;

    /**
     * By default, messages are checked for violations of the OpenAI Community Guidelines and throw an error if any are found.\
     * Set this to `true` to disable this check.\
     * Set this to `"soft"` to still check for violations, but not throw an error if any are found. The violations will be added to the `flags` property of the message.
     *
     * **Note:** This is not recommended, as it could result in account suspension. Additionally, {@link https://platform.openai.com/docs/guides/moderation OpenAI's Moderation API} is free to use.
     *
     * @default false
     */
    disableModeration?: boolean | "soft";
}

/**
 * Combines the {@link ConversationConfigOptions} and {@link ConversationConfigChatCompletionOptions} types.
 */
export type ConversationConfigParameters = ConversationConfigOptions &
    ConversationConfigChatCompletionOptions;

/**
 * Listener for when a {@link Message message}'s content is updated.
 */
export type MessageUpdateListener = (
    /**
     * The new content of the message.
     */
    content: string,

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
