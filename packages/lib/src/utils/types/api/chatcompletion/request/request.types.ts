import { ChatCompletionRequestMessage } from "./message.types.js";
import {
    ChatCompletionRequestTool,
    ChatCompletionRequestToolChoice,
} from "./tool.types.js";

/**
 * Base parameters for a Create Chat Completion request which don't depend on other properties.
 */
export interface ChatCompletionRequestBaseParams {
    /**
     * Your OpenAI API key.
     */
    apiKey: string;

    /**
     * The messages to generate chat completions for, in the {@link https://platform.openai.com/docs/guides/chat/introduction chat format}.
     *
     * @see {@link https://platform.openai.com/docs/api-reference/chat/create#chat/create-messages Create Chat Completion Request Body - messages}
     */
    messages: ChatCompletionRequestMessage[];

    /**
     * ID of the model to use. See the {@link https://platform.openai.com/docs/models/model-endpoint-compatibility model endpoint compatibility} table for details on which models work with the Chat API.
     *
     * @see {@link https://platform.openai.com/docs/api-reference/chat/create#chat/create-model Create Chat Completion Request Body - model}
     */
    model: string;

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
     * The maximum number of {@link https://platform.openai.com/tokenizer tokens} to generate in the chat completion.
     *
     * The total length of input tokens and generated tokens is limited by the model's context length.
     *
     * @default inf
     * @see {@link https://platform.openai.com/docs/api-reference/chat/create#chat/create-max_tokens Create Chat Completion Request Body - max_tokens}
     */
    max_tokens?: number;

    /**
     * Unsupported parameter.
     */
    n?: never;

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
     * Unsupported parameter.
     */
    response_format?: never;

    /**
     * If specified, our system will make a best effort to sample deterministically, such that repeated requests with the same seed and parameters should return the same result.
     * Determinism is not guaranteed, and you should refer to the system_fingerprint response parameter to monitor changes in the backend.
     *
     * @see {@link https://platform.openai.com/docs/api-reference/chat/create#chat-create-seed Create Chat Completion Request Body - seed}
     */
    seed?: number | null;

    /**
     * Up to 4 sequences where the API will stop generating further tokens.
     *
     * @default null
     * @see {@link https://platform.openai.com/docs/api-reference/chat/create#chat/create-stop Create Chat Completion Request Body - stop}
     */
    stop?: string | string[] | null;

    /**
     * If set, partial message deltas will be sent, like in ChatGPT. Tokens will be sent as data-only {@link https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format server-sent events} as they become available, with the stream terminated by a `data: [DONE]` message.
     * See the OpenAI Cookbook for {@link https://github.com/openai/openai-cookbook/blob/main/examples/How_to_stream_completions.ipynb example code}.
     *
     * @default false
     * @see {@link https://platform.openai.com/docs/api-reference/chat/create#chat/create-stream Create Chat Completion Request Body - stream}
     */
    stream?: boolean;

    /**
     * What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.
     *
     * We generally recommend altering this or {@link ChatCompletionRequest.top_p `top_p`} but not both.
     *
     * @default 1
     * @see {@link https://platform.openai.com/docs/api-reference/chat/create#chat/create-temperature Create Chat Completion Request Body - temperature}
     */
    temperature?: number;

    /**
     * An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered.
     *
     * We generally recommend altering this or {@link ChatCompletionRequest.temperature `temperature`} but not both.
     *
     * @default 1
     * @see {@link https://platform.openai.com/docs/api-reference/chat/create#chat/create-top_p Create Chat Completion Request Body - top_p}
     */
    top_p?: number;

    /**
     * A list of tools the model may call.
     * Use this to provide a list of tools the model
     *
     * @see {@link https://platform.openai.com/docs/api-reference/chat/create#chat-create-tools Create Chat Completion Request Body - tools}
     */
    tools?: ChatCompletionRequestTool[];

    /**
     * Controls which (if any) function is called by the model.
     * `none` means the model will not call a function and instead generates a message.
     * `auto` means the model can pick between generating a message or calling a function.
     * Specifying a particular function via `{"type": "function", "function": {"name": "my_function"}}` forces the model to call that function.
     *
     * `none` is the default when no functions are present.
     * `auto` is the default if functions are present.
     */
    tool_choice?: ChatCompletionRequestToolChoice;

    /**
     * A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse. {@link https://platform.openai.com/docs/guides/safety-best-practices/end-user-ids Learn more}.
     *
     * @see {@link https://platform.openai.com/docs/api-reference/chat/create#chat/create-user Create Chat Completion Request Body - user}
     */
    user?: string;
}

export type ChatCompletionRequestLogprobsParams =
    | {
          /**
           * Whether to return log probabilities of the output tokens or not.
           * If true, returns the log probabilities of each output token returned in the `content` of `message`.
           * This option is currently not available on the `gpt-4-vision-preview` model.
           *
           * @default false
           * @see {@link https://platform.openai.com/docs/api-reference/chat/create#chat-create-logprobs Create Chat Completion Request Body - logprobs}
           */
          logprobs?: false | null;
      }
    | {
          /**
           * Whether to return log probabilities of the output tokens or not.
           * If true, returns the log probabilities of each output token returned in the `content` of `message`.
           * This option is currently not available on the `gpt-4-vision-preview` model.
           *
           * @default false
           * @see {@link https://platform.openai.com/docs/api-reference/chat/create#chat-create-logprobs Create Chat Completion Request Body - logprobs}
           */
          logprobs: true;

          /**
           * An integer between 0 and 5 specifying the number of most likely tokens to return at each token position, each with an associated log probability.
           * logprobs must be set to `true` if this parameter is used.
           *
           * @see {@link https://platform.openai.com/docs/api-reference/chat/create#chat-create-top_logprobs Create Chat Completion Request Body - top_logprobs}
           */
          top_logprobs?: number | null;
      };

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
export type ChatCompletionRequest = ChatCompletionRequestBaseParams &
    ChatCompletionRequestLogprobsParams;
