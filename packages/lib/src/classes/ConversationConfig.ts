import {
    DEFAULT_CONTEXT,
    DEFAULT_DISABLEMODERATION,
    DEFAULT_DRY,
    DEFAULT_MODEL,
    DEFAULT_STREAM,
} from "../config/constants.js";
import { CreateChatCompletionRequest } from "../utils/types.js";

export type ChatCompletionConfig = Omit<
    Partial<CreateChatCompletionRequest>,
    "messages"
>;

export interface ConversationConfigParameters {
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
     * By default, messages are checked for violations of the OpenAI Community Guidelines and throw an error if any are found.
     * Set this to true to disable this check.
     * Set this to "soft" to still check for violations, but not throw an error if any are found. The violations will be added to the `flags` property of the message.
     *
     * **Note:** This is not recommended, as it could result in account suspension. Additionally, [OpenAI's Moderation API](https://platform.openai.com/docs/guides/moderation) is free to use.
     *
     * @default false
     */
    disableModeration?: boolean | "soft";
}

type ChatCompletionConfigProperty<K extends keyof ChatCompletionConfig> =
    Exclude<ChatCompletionConfig[K], undefined>;

type ConversationConfigProperty<K extends keyof ConversationConfigParameters> =
    Exclude<ConversationConfigParameters[K], undefined>;

export class ConversationConfig {
    public model: ChatCompletionConfigProperty<"model">;
    public stream: ChatCompletionConfigProperty<"stream">;
    public frequencyPenalty:
        | ChatCompletionConfigProperty<"frequency_penalty">
        | undefined;
    public presencePenalty:
        | ChatCompletionConfigProperty<"presence_penalty">
        | undefined;
    public maxTokens: ChatCompletionConfigProperty<"max_tokens"> | undefined;
    public logitBias: ChatCompletionConfigProperty<"logit_bias"> | undefined;
    public stop: ChatCompletionConfigProperty<"stop"> | undefined;
    public temperature: ChatCompletionConfigProperty<"temperature"> | undefined;
    public topP: ChatCompletionConfigProperty<"top_p"> | undefined;
    public user: ChatCompletionConfigProperty<"user"> | undefined;
    private _apiKey!: ChatCompletionConfigProperty<"apiKey">;

    public disableModeration: ConversationConfigProperty<"disableModeration">;
    private _context!: ConversationConfigProperty<"context">;
    private _dry!: ConversationConfigProperty<"dry">;

    constructor({
        context = DEFAULT_CONTEXT,
        dry = DEFAULT_DRY,
        disableModeration = DEFAULT_DISABLEMODERATION,
        ...chatCompletionConfig
    }: ConversationConfigParameters & ChatCompletionConfig) {
        const {
            apiKey = "",
            model = DEFAULT_MODEL,
            stream = DEFAULT_STREAM,
            frequency_penalty,
            presence_penalty,
            max_tokens,
            logit_bias,
            stop,
            temperature,
            top_p,
            user,
        } = chatCompletionConfig;

        this.apiKey = apiKey;
        this.dry = dry;
        this.model = model;
        this.context = context.trim();
        this.disableModeration = disableModeration;
        this.stream = stream;

        this.frequencyPenalty = frequency_penalty;
        this.presencePenalty = presence_penalty;
        this.maxTokens = max_tokens;
        this.logitBias = logit_bias;
        this.stop = stop;
        this.temperature = temperature;
        this.topP = top_p;
        this.user = user;
    }

    public get apiKey() {
        return this._apiKey;
    }

    public set apiKey(apiKey) {
        this._apiKey = apiKey;
        if (this.dry !== undefined) {
            this.dry = this.dry; // Revalidate dry mode
        }
    }

    public get context() {
        return this._context;
    }

    public set context(context) {
        this._context = context.trim();
    }

    public get dry() {
        return this._dry;
    }

    public set dry(dry) {
        this._dry = dry;
        if (!dry && !this.apiKey) {
            console.warn(
                "[gpt-turbo] No OpenAI API key was provided. Conversation will run on dry mode. If this was intentional, you should explicitly set the 'dry' parameter to 'true'."
            );
            this._dry = true;
        }
    }

    public get isModerationEnabled() {
        return this.isModerationStrict || this.isModerationSoft;
    }

    public get isModerationStrict() {
        if (!this.apiKey) return false;
        return !this.disableModeration;
    }

    public get isModerationSoft() {
        if (!this.apiKey) return false;
        return this.disableModeration === "soft";
    }

    public get config(): Required<ConversationConfigParameters> {
        return {
            context: this.context,
            dry: this.dry,
            disableModeration: this.disableModeration,
        };
    }

    public get chatCompletionConfig(): Required<
        Pick<ChatCompletionConfig, "apiKey" | "model" | "stream">
    > &
        ChatCompletionConfig {
        return {
            apiKey: this.apiKey,
            model: this.model,
            stream: this.stream,
            frequency_penalty: this.frequencyPenalty,
            presence_penalty: this.presencePenalty,
            max_tokens: this.maxTokens,
            logit_bias: this.logitBias,
            stop: this.stop,
            temperature: this.temperature,
            top_p: this.topP,
            user: this.user,
        };
    }
}
