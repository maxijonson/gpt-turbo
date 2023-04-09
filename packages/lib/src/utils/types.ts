import { Message } from "../classes/Message.js";

export type ChatCompletionRequestMessageRoleEnum =
    | "user"
    | "system"
    | "assistant";

export type PromptOptions = Omit<
    CreateChatCompletionRequest,
    "model" | "messages" | "apiKey"
>;

export type HandleChatCompletionOptions = Omit<PromptOptions, "stream">;

export type AddMessageListener = (message: Message) => void;
export type RemoveMessageListener = (message: Message) => void;

export interface RequestOptionsProxy {
    /**
     * The hostname or IP address of the proxy server.
     *
     * Example: `proxy.example.com` or `127.0.0.1`
     */
    host: string;

    /**
     * The port number of the proxy server.
     *
     * Default: `80`
     */
    port?: number;

    /**
     * The HTTP protocol to use.
     */
    protocol?: "http" | "https";

    /**
     * HTTP Basic credentials for the proxy server.
     *
     * A header will be added to the request: \
     * `Proxy-Authorization: Basic ${base64(username:password)}`
     */
    auth?: {
        username: string;
        password: string;
    };
}

export interface RequestOptions {
    /**
     * Additional headers to send with the request.
     *
     * Note that the `Content-Type`, `Authorization` and `Proxy-Authorization` headers are ignored, as they will be overwritten by the SDK.
     */
    headers?: Record<string, string>;

    /**
     * Proxy configuration to use for the request.
     *
     * Example request with proxy:\
     * `https://my.proxy.com:1337/https://api.openai.com/v1/chat/completions`
     */
    proxy?: RequestOptionsProxy;
}

export interface CreateChatCompletionMessage {
    /**
     * The role of who sent the message.
     *
     * Can be "user", "system", or "assistant". "system" refers to the context of the conversation.
     */
    role: "user" | "system" | "assistant";

    /**
     * The message content.
     */
    content: string;
}

export interface CreateChatCompletionRequest {
    /**
     * Your OpenAI API key.
     */
    apiKey: string;

    /**
     * ID of the model to use. See the [model endpoint compatibility](https://platform.openai.com/docs/models/model-endpoint-compatibility) table for details on which models work with the Chat API.
     *
     * @see https://platform.openai.com/docs/api-reference/chat/create#chat/create-model
     */
    model: string;

    /**
     * The messages to generate chat completions for, in the [chat format](https://platform.openai.com/docs/guides/chat/introduction).
     *
     * @see https://platform.openai.com/docs/api-reference/chat/create#chat/create-messages
     */
    messages: CreateChatCompletionMessage[];

    /**
     * What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.
     *
     * We generally recommend altering this or `top_p` but not both.
     *
     * @see https://platform.openai.com/docs/api-reference/chat/create#chat/create-temperature
     */
    temperature?: number;

    /**
     * An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered.
     *
     * We generally recommend altering this or `temperature` but not both.
     *
     * @see https://platform.openai.com/docs/api-reference/chat/create#chat/create-top_p
     */
    top_p?: number;

    /**
     * If set, partial message deltas will be sent, like in ChatGPT. Tokens will be sent as data-only [server-sent events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format) as they become available, with the stream terminated by a `data: [DONE]` message. See the OpenAI Cookbook for [example code](https://github.com/openai/openai-cookbook/blob/main/examples/How_to_stream_completions.ipynb).
     *
     * @see https://platform.openai.com/docs/api-reference/chat/create#chat/create-stream
     */
    stream?: boolean;

    /**
     * Up to 4 sequences where the API will stop generating further tokens.
     *
     * @see https://platform.openai.com/docs/api-reference/chat/create#chat/create-stop
     */
    stop?: string | string[];

    /**
     * The maximum number of [tokens](https://platform.openai.com/tokenizer) to generate in the chat completion.
     *
     * The total length of input tokens and generated tokens is limited by the model's context length.
     *
     * @see https://platform.openai.com/docs/api-reference/chat/create#chat/create-max_tokens
     */
    max_tokens?: number;

    /**
     * Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
     *
     * [See more information about frequency and presence penalties.](https://platform.openai.com/docs/api-reference/parameter-details)
     *
     * @see https://platform.openai.com/docs/api-reference/chat/create#chat/create-presence_penalty
     */
    presence_penalty?: number;

    /**
     * Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
     *
     * [See more information about frequency and presence penalties.](https://platform.openai.com/docs/api-reference/parameter-details)
     *
     * @see https://platform.openai.com/docs/api-reference/chat/create#chat/create-frequency_penalty
     */
    frequency_penalty?: number;

    /**
     * Modify the likelihood of specified tokens appearing in the completion.
     *
     * Accepts a json object that maps tokens (specified by their token ID in the tokenizer) to an associated bias value from -100 to 100. Mathematically, the bias is added to the logits generated by the model prior to sampling. The exact effect will vary per model, but values between -1 and 1 should decrease or increase likelihood of selection; values like -100 or 100 should result in a ban or exclusive selection of the relevant token.
     *
     * @see https://platform.openai.com/docs/api-reference/chat/create#chat/create-logit_bias
     */
    logit_bias?: {
        [token: number]: number;
    };

    /**
     * A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse. [Learn more](https://platform.openai.com/docs/guides/safety-best-practices/end-user-ids).
     *
     * @see https://platform.openai.com/docs/api-reference/chat/create#chat/create-user
     */
    user?: string;
}

/**
 * @see https://platform.openai.com/docs/guides/chat/response-format
 */
export interface CreateChatCompletionResponse {
    id: string;
    object: string;
    created: number;
    model: string;
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
    choices: [
        {
            message: CreateChatCompletionMessage;
            finish_reason: string;
            index: number;
        }
    ];
}

export interface CreateChatCompletionStreamResponse {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: [
        {
            delta: CreateChatCompletionMessage;
            finish_reason: string | null;
            index: number;
        }
    ];
}

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
     * The flagged categories and their scores.
     */
    results: [
        {
            categories: {
                hate: boolean;
                "hate/threatening": boolean;
                "self-harm": boolean;
                sexual: boolean;
                "sexual/minors": boolean;
                violence: boolean;
                "violence/graphic": boolean;
            };
            category_scores: {
                hate: number;
                "hate/threatening": number;
                "self-harm": number;
                sexual: number;
                "sexual/minors": number;
                violence: number;
                "violence/graphic": number;
            };
            flagged: boolean;
        }
    ];
}

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
