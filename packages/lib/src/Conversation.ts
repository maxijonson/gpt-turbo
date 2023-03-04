import {
    ConversationConfig,
    ConversationConfigParameters,
} from "./ConversationConfig";
import {
    OpenAIApi,
    ChatCompletionRequestMessage,
    CreateChatCompletionRequest,
    ChatCompletionRequestMessageRoleEnum,
} from "openai";
import { encode } from "gpt-3-encoder";

type ChatCompletionRequestOptions = Omit<
    CreateChatCompletionRequest,
    "model" | "messages" | "stream"
>;

export type ConversationMessage = ChatCompletionRequestMessage & {
    tokens: number[];
};

export class Conversation {
    private config: ConversationConfig;
    private openai: OpenAIApi;
    private messages: ConversationMessage[];

    constructor(config: ConversationConfigParameters) {
        this.config = new ConversationConfig(config);
        this.openai = new OpenAIApi(this.config);
        this.messages = [this.createMessage(this.config.context, "system")];
    }

    private createMessage(
        content: string,
        role: ChatCompletionRequestMessageRoleEnum
    ) {
        return { role, content, tokens: encode(content) };
    }

    /**
     * Get the messages in the conversation.
     *
     * @param includeContext Whether to include the context message in the returned array.
     * @returns A shallow copy of the messages.
     */
    public getMessages(includeContext = false) {
        return includeContext ? this.messages.slice(0) : this.messages.slice(1);
    }

    /**
     * Adds a message with the role of "assistant" to the conversation.
     *
     * @param message The content of the message.
     */
    public addAssistantMessage(message: string) {
        if (!message.trim()) return;
        this.messages.push(this.createMessage(message, "assistant"));
    }

    /**
     * Adds a message with the role of "user" to the conversation.
     *
     * @param message The content of the message.
     */
    public addUserMessage(message: string) {
        if (!message.trim()) return;
        this.messages.push(this.createMessage(message, "user"));
    }

    /**
     * Clears all messages in the conversation except the context message.
     */
    public clearMessages() {
        this.messages = [this.createMessage(this.config.context, "system")];
    }

    /**
     * Sets the context message at the beginning of the conversation.
     *
     * @param context The new context message.
     */
    public setContext(context: string) {
        this.config.context = context;
        this.messages[0].content = context;
    }

    /**
     * Fires a "createChatCompletion" request to the OpenAI API with the current messages.
     *
     * @param options Additional options to pass to the createChatCompletion request.
     * @returns The response from the OpenAI API.
     */
    public async getChatCompletionResponse(
        options: ChatCompletionRequestOptions = {}
    ) {
        const response = await this.openai.createChatCompletion({
            ...options,
            model: this.config.model,
            messages: this.messages.map(({ tokens, ...message }) => message),
            stream: false,
        });
        const responseMessage =
            response.data.choices[0].message?.content ?? null;
        return responseMessage;
    }

    /**
     * Adds the prompt as a user message (`addUserMessage`), gets the response from the OpenAI API (`getChatCompletionResponse`), and adds the response as an assistant message (`addAssistantMessage`).
     *
     * @param prompt The prompt to send to the assistant.
     * @param options Additional options to pass to the createChatCompletion request.
     * @returns The assistant's response.
     */
    public async prompt(
        prompt: string,
        options?: ChatCompletionRequestOptions
    ) {
        if (!prompt.trim()) return null;
        this.addUserMessage(prompt);
        const responseMessage = await this.getChatCompletionResponse(options);
        if (responseMessage) {
            this.addAssistantMessage(responseMessage);
        }
        return responseMessage;
    }

    /**
     * Returns the size of the conversation in tokens.
     */
    public getSize() {
        return this.messages.reduce(
            (size, message) => size + message.tokens.length,
            0
        );
    }
}
