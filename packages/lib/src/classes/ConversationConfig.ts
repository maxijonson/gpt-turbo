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
    ChatCompletionConfigProperties,
    ConfigProperties,
    ConversationConfigProperties,
} from "../utils/types/index.js";
import { ConversationPluginService } from "./ConversationPluginService.js";

/**
 * The configuration for a conversation. Contains library specific options and OpenAI's Chat Completion default options.
 *
 * @internal
 * This class is used internally by the library and is not meant to be **instantiated** by consumers of the library.
 */
export class ConversationConfig {
    // OpenAI-specific options
    public model!: ChatCompletionConfigProperties["model"];
    public stream!: ChatCompletionConfigProperties["stream"];
    public frequencyPenalty: ChatCompletionConfigProperties["frequency_penalty"];
    public presencePenalty: ChatCompletionConfigProperties["presence_penalty"];
    public maxTokens: ChatCompletionConfigProperties["max_tokens"];
    public logitBias: ChatCompletionConfigProperties["logit_bias"];
    public temperature: ChatCompletionConfigProperties["temperature"];
    public topP: ChatCompletionConfigProperties["top_p"];
    public user: ChatCompletionConfigProperties["user"];
    public functionCall: ChatCompletionConfigProperties["function_call"];
    private _stop: ChatCompletionConfigProperties["stop"];
    private _apiKey!: ChatCompletionConfigProperties["apiKey"];

    // Library-specific options
    public disableModeration!: ConversationConfigProperties["disableModeration"];
    private _context!: ConversationConfigProperties["context"];
    private _dry!: ConversationConfigProperties["dry"];

    constructor(
        private readonly pluginService: ConversationPluginService,
        options: ConversationConfigModel = {}
    ) {
        this.setConfig(options);
    }

    /**
     * Serializes the ConversationConfig to JSON.
     *
     * @returns The `ConversationConfig` as a JSON object.
     *
     * @internal
     * This method is used internally by the library and is not meant to be used by consumers of the library.
     */
    public toJSON(): ConversationConfigModel {
        const json: ConversationConfigModel = this.getConfig();
        return conversationConfigSchema.parse(
            this.pluginService.transformConversationConfigJson(json)
        );
    }

    /**
     * Returns the **library-specific** options of the config.
     */
    public getConversationConfig(): ConversationConfigProperties {
        return {
            context: this.context,
            dry: this.dry,
            disableModeration: this.disableModeration,
        };
    }

    /**
     * Returns the **OpenAI-specific** options of the config.
     */
    public getChatCompletionConfig(): ChatCompletionConfigProperties {
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
            function_call: this.functionCall,
        };
    }

    /**
     * Returns both the **library-specific** and **OpenAI-specific** options of the config.
     */
    public getConfig(): ConfigProperties {
        return {
            ...this.getChatCompletionConfig(),
            ...this.getConversationConfig(),
        };
    }

    /**
     * Assigns a new config to the conversation.
     *
     * @param config The new config to use.
     * @param merge Set to `true` to shallow merge the new config with the existing config instead of replacing it.
     */
    public setConfig(config: Partial<ConfigProperties>, merge = false) {
        const {
            context = DEFAULT_CONTEXT,
            dry = DEFAULT_DRY,
            disableModeration = DEFAULT_DISABLEMODERATION,
            ...chatCompletionConfig
        } = merge ? { ...this.getConfig(), ...config } : config;

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
            function_call,
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
        this.functionCall = function_call;
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
