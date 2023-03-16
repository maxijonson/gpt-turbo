import {
    DEFAULT_CONTEXT,
    DEFAULT_DISABLEMODERATION,
    DEFAULT_DRY,
    DEFAULT_MODEL,
} from "../config/constants.js";
import { Configuration, ConfigurationParameters } from "openai";

export interface ConversationConfigParameters extends ConfigurationParameters {
    /**
     * Chat completion model to use.
     *
     * @default "gpt-3.5-turbo"
     */
    model?: string;

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

export class ConversationConfig extends Configuration {
    private _model: Exclude<ConversationConfigParameters["model"], undefined>;
    private _context: Exclude<
        ConversationConfigParameters["context"],
        undefined
    >;
    private _dry!: Exclude<ConversationConfigParameters["dry"], undefined>;
    private _disableModeration: Exclude<
        ConversationConfigParameters["disableModeration"],
        undefined
    >;

    constructor({
        model = DEFAULT_MODEL,
        context = DEFAULT_CONTEXT,
        dry = DEFAULT_DRY,
        disableModeration = DEFAULT_DISABLEMODERATION,
        ...configParameters
    }: ConversationConfigParameters) {
        super(configParameters);
        this._model = model;
        this._context = context.trim();
        this._disableModeration = disableModeration;
        this.setDry(dry);
    }

    public get model() {
        return this._model;
    }

    public set model(model) {
        this._model = model;
    }

    public get context() {
        return this._context;
    }

    public set context(context) {
        this._context = context.trim();
    }

    private setDry(dry: typeof this._dry) {
        this._dry = dry;
        if (!dry && !this.apiKey) {
            console.warn(
                "[gpt-turbo] No OpenAI API key was provided. Conversation will run on dry mode. If this was intentional, you should explicitly set the 'dry' parameter to 'true'."
            );
            this._dry = true;
        }
    }

    public get dry() {
        return this._dry;
    }

    public set dry(dry) {
        this.setDry(dry);
    }

    public get disableModeration() {
        return this._disableModeration;
    }

    public set disableModeration(disableModeration) {
        this._disableModeration = disableModeration;
    }

    public get isModerationEnabled() {
        if (!this.apiKey) return false;
        return this.isModerationStrict || this.isModerationSoft;
    }

    public get isModerationStrict() {
        return !this._disableModeration;
    }

    public get isModerationSoft() {
        return this._disableModeration === "soft";
    }
}
