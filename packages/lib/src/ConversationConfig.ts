import {
    DEFAULT_CONTEXT,
    DEFAULT_DRY,
    DEFAULT_MODEL,
} from "./config/constants.js";
import { Configuration, ConfigurationParameters } from "openai";
import { ChatCompletionModel } from "./utils/types.js";

export interface ConversationConfigParameters extends ConfigurationParameters {
    /**
     * OpenAI API key
     */
    apiKey: string;

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
}

export class ConversationConfig extends Configuration {
    public apiKey: ConversationConfigParameters["apiKey"];

    private _model: Exclude<ConversationConfigParameters["model"], undefined>;
    private _context: Exclude<
        ConversationConfigParameters["context"],
        undefined
    >;
    private _dry: Exclude<ConversationConfigParameters["dry"], undefined>;

    constructor({
        model = DEFAULT_MODEL,
        context = DEFAULT_CONTEXT,
        dry = DEFAULT_DRY,
        ...configParameters
    }: ConversationConfigParameters) {
        super(configParameters);
        this.apiKey = configParameters.apiKey;
        this._model = model;
        this._context = context.trim();
        this._dry = dry;
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

    public get dry() {
        return this._dry;
    }

    public set dry(dry: boolean) {
        this._dry = dry;
    }
}
