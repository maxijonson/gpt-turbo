import {
    DEFAULT_CONTEXT,
    DEFAULT_DISABLEMODERATION,
    DEFAULT_DRY,
    DEFAULT_MODEL,
} from "./config/constants.js";
import { Configuration, ConfigurationParameters } from "openai";
import { ChatCompletionModel } from "./utils/types.js";

export interface ConversationConfigParameters extends ConfigurationParameters {
    /**
     * Chat completion model to use.
     *
     * @default "gpt-3.5-turbo"
     */
    model?: ChatCompletionModel;

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
     * By default, messages are checked for violations of the OpenAI Community Guidelines. Set this to true to disable this check.
     *
     * **Note:** This is not recommended, as it could result in account suspension. Additionally, [OpenAI's Moderation API](https://platform.openai.com/docs/guides/moderation) is free to use.
     *
     * @default false
     */
    disableModeration?: boolean;
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

    public set model(model: ChatCompletionModel) {
        this._model = model;
    }

    public get context() {
        return this._context;
    }

    public set context(context: string) {
        this._context = context.trim();
    }

    private setDry(dry: boolean) {
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

    public set dry(dry: boolean) {
        this.setDry(dry);
    }

    public get disableModeration() {
        return this._disableModeration;
    }

    public set disableModeration(disableModeration: boolean) {
        this._disableModeration = disableModeration;
    }
}
