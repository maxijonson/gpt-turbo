import {
    DEFAULT_CONTEXT,
    DEFAULT_DISABLEMODERATION,
    DEFAULT_DRY,
    DEFAULT_MODEL,
    DEFAULT_STREAM,
} from "../config/constants.js";
import {
    ConversationConfigModel,
    conversationConfigSchema,
} from "../schemas/conversationConfig.schema.js";
import {
    ConversationConfigChatCompletionOptions,
    ConversationConfigOptions,
    ConversationConfigParameters,
} from "../utils/types.js";

type ConversationConfigChatCompletionRequiredOption<
    K extends keyof ConversationConfigChatCompletionOptions
> = Exclude<ConversationConfigChatCompletionOptions[K], undefined>;

type ConversationConfigRequiredOption<
    K extends keyof ConversationConfigOptions
> = Exclude<ConversationConfigOptions[K], undefined>;

/**
 * The configuration for a conversation. Contains library specific options and OpenAI's Chat Completion default options.
 *
 * @remarks
 * Since this class is only instanciated by the Conversation class internally and is not required by any of its public methods, you should not need to use this class directly.
 *
 * @internal
 */
export class ConversationConfig {
    public model: ConversationConfigChatCompletionRequiredOption<"model">;
    public stream: ConversationConfigChatCompletionRequiredOption<"stream">;
    public frequencyPenalty: ConversationConfigChatCompletionOptions["frequency_penalty"];
    public presencePenalty: ConversationConfigChatCompletionOptions["presence_penalty"];
    public maxTokens: ConversationConfigChatCompletionOptions["max_tokens"];
    public logitBias: ConversationConfigChatCompletionOptions["logit_bias"];
    public temperature: ConversationConfigChatCompletionOptions["temperature"];
    public topP: ConversationConfigChatCompletionOptions["top_p"];
    public user: ConversationConfigChatCompletionOptions["user"];
    private _stop: ConversationConfigChatCompletionOptions["stop"];
    private _apiKey!: ConversationConfigChatCompletionRequiredOption<"apiKey">;

    public disableModeration: ConversationConfigRequiredOption<"disableModeration">;
    private _context!: ConversationConfigRequiredOption<"context">;
    private _dry!: ConversationConfigRequiredOption<"dry">;

    constructor({
        context = DEFAULT_CONTEXT,
        dry = DEFAULT_DRY,
        disableModeration = DEFAULT_DISABLEMODERATION,
        ...chatCompletionConfig
    }: ConversationConfigParameters) {
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

    /**
     * Creates a new `ConversationConfig` instance from a serialized config.
     *
     * @param json The JSON object of a ConversationConfig instance.
     * @returns A new `ConversationConfig` instance
     */
    public static fromJSON(json: ConversationConfigModel) {
        return new ConversationConfig(conversationConfigSchema.parse(json));
    }

    /**
     * Serializes the ConversationConfig to JSON.
     *
     * @returns The `ConversationConfig` as a JSON object.
     */
    public toJSON(): ConversationConfigModel {
        const json: ConversationConfigModel = {
            dry: this.dry,
            apiKey: this.apiKey,
            model: this.model,
            stream: this.stream,
            disableModeration: this.disableModeration,
            context: this.context,
            frequency_penalty: this.frequencyPenalty,
            presence_penalty: this.presencePenalty,
            max_tokens: this.maxTokens,
            logit_bias: this.logitBias,
            temperature: this.temperature,
            top_p: this.topP,
            user: this.user,
            stop: this.stop,
        };
        return conversationConfigSchema.parse(json);
    }

    public get config(): Required<ConversationConfigOptions> {
        return {
            context: this.context,
            dry: this.dry,
            disableModeration: this.disableModeration,
        };
    }

    public get chatCompletionConfig(): Required<
        Pick<
            ConversationConfigChatCompletionOptions,
            "apiKey" | "model" | "stream"
        >
    > &
        ConversationConfigChatCompletionOptions {
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

    public get stop() {
        return this._stop;
    }

    public set stop(stop) {
        if (Array.isArray(stop) && !stop.length) {
            console.warn(
                "[gpt-turbo] The 'stop' parameter was provided as an empty array, which would cause a Bad Request error from OpenAI. The 'stop' parameter will be set to 'null' instead."
            );
            this._stop = null;
            return;
        }
        if (typeof stop === "string" && !stop.trim()) {
            console.warn(
                "[gpt-turbo] The 'stop' parameter was provided as an empty string, which would cause a Bad Request error from OpenAI. The 'stop' parameter will be set to 'null' instead."
            );
            this._stop = null;
            return;
        }
        this._stop = stop;
    }
}
