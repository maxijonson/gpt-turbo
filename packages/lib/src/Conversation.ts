import {
    ConversationConfig,
    ConversationConfigParameters,
} from "./ConversationConfig";
import {
    OpenAIApi,
    CreateChatCompletionRequest,
    ChatCompletionRequestMessageRoleEnum,
} from "openai";
import { getMessageSize, getMessageCost, ConversationMessage } from "./utils";

type ChatCompletionRequestOptions = Omit<
    CreateChatCompletionRequest,
    "model" | "messages" | "stream"
>;
export class Conversation {
    private config: ConversationConfig;
    private openai: OpenAIApi;
    private messages: ConversationMessage[] = [];
    private cumulativeSize = 0;
    private cumulativeCost = 0;

    constructor(config: ConversationConfigParameters) {
        this.config = new ConversationConfig(config);
        this.openai = new OpenAIApi(this.config);
        this.clearMessages();
    }

    private createMessage(
        content: string,
        role: ChatCompletionRequestMessageRoleEnum
    ): ConversationMessage {
        return { role, content };
    }

    /**
     * Get the messages in the conversation.
     *
     * @param includeContext Whether to include the context message in the returned array.
     * @returns A **shallow copy** of the messages array.
     */
    public getMessages(includeContext = false) {
        if (!this.config.context) return this.messages.slice(0);
        return includeContext ? this.messages.slice(0) : this.messages.slice(1);
    }

    /**
     * Adds a message with the role of "assistant" to the conversation.
     *
     * @param message The content of the message.
     * @returns The [ConversationMessage](./utils/types.ts) object that was added to the conversation, or `null` if none was added (e.g. if the message was empty).
     */
    public addAssistantMessage(message: string) {
        const trimmedMessage = message.trim();
        if (!trimmedMessage) return null;
        const assistantMessage = this.createMessage(
            trimmedMessage,
            "assistant"
        );
        this.messages.push(assistantMessage);
        return assistantMessage;
    }

    /**
     * Adds a message with the role of "user" to the conversation.
     *
     * @param message The content of the message.
     * @returns The [ConversationMessage](./utils/types.ts) object that was added to the conversation, or `null` if none was added (e.g. if the message was empty).
     */
    public addUserMessage(message: string) {
        const trimmedMessage = message.trim();
        if (!trimmedMessage) return null;
        const userMessage = this.createMessage(trimmedMessage, "user");
        this.messages.push(userMessage);
        return userMessage;
    }

    /**
     * Clears all messages in the conversation except the context message, if it is set.
     */
    public clearMessages() {
        this.messages = this.config.context
            ? [this.createMessage(this.config.context, "system")]
            : [];
    }

    /**
     * Sets the context message at the beginning of the conversation.
     *
     * @param context The new context message.
     */
    public setContext(context: string) {
        this.config.context = context.trim();
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
        let responseMessage: string | null = null;

        if (this.config.dry) {
            responseMessage =
                this.messages[this.messages.length - 1]?.content ?? null;
        } else {
            const messages = this.messages.map(
                ({ _size, _cost, ...message }) => message
            );
            const response = await this.openai.createChatCompletion({
                ...options,
                model: this.config.model,
                messages,
                stream: false,
            });
            responseMessage = response.data.choices[0].message?.content ?? null;
        }

        if (!responseMessage) return null;

        this.cumulativeSize += this.getSize() + getMessageSize(responseMessage);
        this.cumulativeCost += this.getCost() + getMessageCost(responseMessage);
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
        const userMessage = this.addUserMessage(prompt);
        if (!userMessage) return null;
        const responseMessage = await this.getChatCompletionResponse(options);
        const assistantMessage = this.addAssistantMessage(
            responseMessage ?? ""
        );
        return assistantMessage?.content ?? null;
    }

    /**
     * Returns the size of the conversation in tokens.
     */
    public getSize() {
        return this.messages.reduce(
            (size, message) => size + getMessageSize(message),
            0
        );
    }

    /**
     * Everytime a prompt is sent (using `prompt` or `getChatCompletionResponse`), the size of the conversation (in tokens) is added to an internal cumulative size. This method returns this cumulative size.
     */
    public getCumulativeSize() {
        return this.cumulativeSize;
    }

    /**
     * Gets the (estimated) cost of the conversation by summing the cost of each message stored.
     * This roughly represents the cost of sending the conversation to OpenAI as it stands right now.
     * Costs are calculated using OpenAI's [pricing page](https://openai.com/pricing#chat) and are calculated on a per-token basis of the context, user messages, and assistant messages.
     *
     * Note: This estimate is based on OpenAI's [pricing page](https://openai.com/pricing#chat)
     */
    public getCost() {
        return this.messages.reduce(
            (cost, message) => cost + getMessageCost(message),
            0
        );
    }

    /**
     * Everytime a prompt is sent (using `prompt` or `getChatCompletionResponse`), the estimated cost of the conversation is added to an internal cumulative cost. This method returns this cumulative cost.
     */
    public getCumulativeCost() {
        return this.cumulativeCost;
    }
}
