import {
    ConversationConfig,
    ConversationConfigParameters,
} from "./ConversationConfig.js";
import {
    OpenAIApi,
    CreateChatCompletionRequest,
    ChatCompletionRequestMessageRoleEnum,
} from "openai";
import { v4 as uuid } from "uuid";
import {
    getMessageSize,
    getMessageCost,
    ConversationMessage,
    AddMessageListener,
} from "./utils/index.js";

type ChatCompletionRequestOptions = Omit<
    CreateChatCompletionRequest,
    "model" | "messages" | "stream"
>;
export class Conversation {
    private config: ConversationConfig;
    private openai: OpenAIApi;
    private messages: ConversationMessage[] = [];
    private addMessageListeners: AddMessageListener[] = [];
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
        return { id: uuid(), role, content };
    }

    private notifyMessageAdded(message: ConversationMessage) {
        this.addMessageListeners.forEach((listener) => listener(message));
    }

    private addMessage(message: ConversationMessage) {
        message.content = message.content.trim();
        if (!message.content) return;

        if (message.role === "system") {
            this.config.context = message.content;
            if (this.messages[0]?.role === "system") {
                this.messages[0] = message;
            } else {
                this.messages.unshift(message);
            }
        } else {
            this.messages.push(message);
        }

        this.notifyMessageAdded(message);
        return message;
    }

    private addSystemMessage(message: string) {
        const systemMessage = this.createMessage(message, "system");
        return this.addMessage(systemMessage);
    }

    /**
     * Adds a message with the role of "assistant" to the conversation.
     *
     * @param message The content of the message.
     * @returns The [ConversationMessage](./utils/types.ts) object that was added to the conversation, or `null` if none was added (e.g. if the message was empty).
     */
    public addAssistantMessage(message: string) {
        const assistantMessage = this.createMessage(message, "assistant");
        return this.addMessage(assistantMessage);
    }

    /**
     * Adds a message with the role of "user" to the conversation.
     *
     * @param message The content of the message.
     * @returns The [ConversationMessage](./utils/types.ts) object that was added to the conversation, or `null` if none was added (e.g. if the message was empty).
     */
    public addUserMessage(message: string) {
        const userMessage = this.createMessage(message, "user");
        return this.addMessage(userMessage);
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
     * Removes a listener function from the list of listeners that was previously added with `onMessageAdded`.
     * @param listener The function to remove from the list of listeners.
     */
    public offMessageAdded(listener: AddMessageListener) {
        const index = this.addMessageListeners.indexOf(listener);
        if (index !== -1) this.addMessageListeners.splice(index, 1);
    }

    /**
     * Adds a listener function that is called whenever a message is added to the conversation.
     *
     * @param listener The function to call when a message is added to the conversation.
     * @returns A function that removes the listener from the list of listeners.
     */
    public onMessageAdded(listener: AddMessageListener) {
        this.addMessageListeners.push(listener);
        return () => this.offMessageAdded(listener);
    }

    /**
     * Clears all messages in the conversation except the context message, if it is set.
     */
    public clearMessages() {
        this.messages = [];
        this.addSystemMessage(this.config.context);
    }

    /**
     * Sets the context message at the beginning of the conversation.
     *
     * @param context The new context message.
     */
    public setContext(context: string) {
        this.addSystemMessage(context);
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
            await new Promise((resolve) => setTimeout(resolve, 1000));
            responseMessage =
                this.messages[this.messages.length - 1]?.content ?? null;
        } else {
            const messages = this.messages.map(({ role, content }) => ({
                role,
                content,
            }));
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
