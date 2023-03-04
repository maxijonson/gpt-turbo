import { DEFAULT_CONTEXT, DEFAULT_MODEL } from "./config/constants";
import { Configuration, ConfigurationParameters } from "openai";
import { ChatCompletionModel } from "./utils/types";

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
}

export class ConversationConfig extends Configuration {
    /**
     * OpenAI API key
     */
    public apiKey: ConversationConfigParameters["apiKey"];

    /**
     * Chat completion model to use.
     */
    public model: Exclude<ConversationConfigParameters["model"], undefined>;

    /**
     * The first system message to set the context for the GPT model.
     */
    public context: Exclude<ConversationConfigParameters["context"], undefined>;

    constructor({
        model = DEFAULT_MODEL,
        context = DEFAULT_CONTEXT,
        ...configParameters
    }: ConversationConfigParameters) {
        super(configParameters);
        this.apiKey = configParameters.apiKey;
        this.model = model;
        this.context = context;
    }
}
