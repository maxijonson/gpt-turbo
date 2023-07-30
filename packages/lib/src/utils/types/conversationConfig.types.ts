import { CreateChatCompletionRequest } from "./chatCompletionService.types.js";

/**
 * **OpenAI-specific** configuration options for the {@link Conversation} class, used by the {@link ConversationConfig} class.
 *
 * @remarks
 * The `messages` property is omitted since messages is handled entirely by the library.
 */
export type ChatCompletionConfigOptions = Omit<
    Partial<CreateChatCompletionRequest>,
    "messages"
>;

/**
 * **Library specific** configuration options for the {@link Conversation} class, used by the {@link ConversationConfig} class.
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
 * Although all properties of `ChatCompletionConfigOptions` are optional, some of them are certain to have a value when used in a `ConversationConfig` instance.
 *
 * @internal Only used for convenience within the `ConversationConfig` class. Not meant to be used by consumers of the library.
 */
export type ChatCompletionConfigProperties = ChatCompletionConfigOptions &
    Required<Pick<ChatCompletionConfigOptions, "apiKey" | "model" | "stream">>;

/**
 * Although all properties of `ConversationConfigOptions` are optional, some of them are certain to have a value when used in a `ConversationConfig` instance.
 *
 * @internal Only used for convenience within the `ConversationConfig` class. Not meant to be used by consumers of the library.
 */
export type ConversationConfigProperties = ConversationConfigOptions &
    Required<
        Pick<ConversationConfigOptions, "context" | "dry" | "disableModeration">
    >;

/**
 * @internal Only used for convenience within the `ConversationConfig` class. Not meant to be used by consumers of the library.
 */
export type ConfigProperties = ChatCompletionConfigProperties &
    ConversationConfigProperties;
