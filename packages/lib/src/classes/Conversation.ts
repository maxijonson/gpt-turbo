import {
    ConversationConfig,
    ConversationConfigParameters,
} from "./ConversationConfig.js";
import { OpenAIApi, CreateChatCompletionRequest } from "openai";
import {
    getMessageSize,
    getMessageCost,
    ConversationMessage,
    AddMessageListener,
    RemoveMessageListener,
    createMessage,
} from "../utils/index.js";
import { ModerationException } from "../exceptions/ModerationException.js";

type ChatCompletionRequestOptions = Omit<
    CreateChatCompletionRequest,
    "model" | "messages" | "stream"
>;
export class Conversation {
    private config: ConversationConfig;
    private openai: OpenAIApi;
    private messages: ConversationMessage[] = [];
    private addMessageListeners: AddMessageListener[] = [];
    private removeMessageListeners: RemoveMessageListener[] = [];
    private cumulativeSize = 0;
    private cumulativeCost = 0;

    constructor(config: ConversationConfigParameters) {
        this.config = new ConversationConfig(config);
        this.openai = new OpenAIApi(this.config);
        this.clearMessages();
    }

    private notifyMessageAdded(message: ConversationMessage) {
        this.addMessageListeners.forEach((listener) => listener(message));
    }

    private notifyMessageRemoved(message: ConversationMessage) {
        this.removeMessageListeners.forEach((listener) => listener(message));
    }

    private async addMessage(message: ConversationMessage) {
        message.content = message.content.trim();
        if (!message.content) return null;

        if (this.config.isModerationEnabled) {
            message.flags = await this.getMessageFlags(message.content);
            if (this.config.isModerationStrict && message.flags.length > 0) {
                throw new ModerationException(message.flags);
            }
        }

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
        const systemMessage = createMessage(message, "system");
        return this.addMessage(systemMessage);
    }

    /**
     * Adds a message with the role of "assistant" to the conversation.
     *
     * @param message The content of the message.
     * @returns The [ConversationMessage](./utils/types.ts) object that was added to the conversation, or `null` if none was added (e.g. if the message was empty).
     */
    public addAssistantMessage(message: string) {
        const assistantMessage = createMessage(message, "assistant");
        return this.addMessage(assistantMessage);
    }

    /**
     * Adds a message with the role of "user" to the conversation.
     *
     * @param message The content of the message.
     * @returns The [ConversationMessage](./utils/types.ts) object that was added to the conversation, or `null` if none was added (e.g. if the message was empty).
     */
    public addUserMessage(message: string) {
        const userMessage = createMessage(message, "user");
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
     *
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
     * Removes a listener function from the list of listeners that was previously added with `onMessageRemoved`.
     *
     * @param listener The function to remove from the list of listeners.
     */
    public offMessageRemoved(listener: RemoveMessageListener) {
        const index = this.removeMessageListeners.indexOf(listener);
        if (index !== -1) this.removeMessageListeners.splice(index, 1);
    }

    /**
     * Adds a listener function that is called whenever a message is removed to the conversation.
     *
     * @param listener The function to call when a message is removed to the conversation.
     * @returns A function that removes the listener from the list of listeners.
     */
    public onMessageRemoved(listener: RemoveMessageListener) {
        this.removeMessageListeners.push(listener);
        return () => this.offMessageRemoved(listener);
    }

    /**
     * Clears all messages in the conversation except the context message, if it is set.
     */
    public clearMessages() {
        this.messages = [];
        this.addSystemMessage(this.config.context);
    }

    /**
     * Removes a message from the conversation's history.
     *
     * @param message Either the ID of the message to remove, or the message object itself (where the ID will be extracted from).
     */
    public removeMessage(message: string | ConversationMessage) {
        const id = typeof message === "string" ? message : message.id;
        const index = this.messages.findIndex((m) => m.id === id);
        if (index === -1) return;
        const removedMessage = this.messages.splice(index, 1)[0];
        this.notifyMessageRemoved(removedMessage);
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
     * Check whether the message complies with OpenAI's [usage policies](https://openai.com/policies/usage-policies).
     *
     * @param message The message to check for violations.
     * @returns The Moderation response from the [OpenAI's Moderation API](https://platform.openai.com/docs/guides/moderation/overview).
     */
    public async getModerationResponse(message: string) {
        const response = await this.openai.createModeration({
            input: message,
        });
        return response.data.results[0];
    }

    /**
     * Check whether the message complies with OpenAI's [usage policies](https://openai.com/policies/usage-policies).
     * The flags are returned as an array of violated categories (if any).
     *
     * @param message The message to check for violations.
     */
    public async getMessageFlags(message: string) {
        const { flagged, categories } = await this.getModerationResponse(
            message
        );

        return flagged
            ? Object.keys(categories).filter(
                  (category) => categories[category as keyof typeof categories]
              )
            : [];
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
     * This is the **recommended** way to interact with the GPT model. It's a wrapper method around the following public methods (which you can use directly if you want more control over the conversation flow):
     * - `getModerationResponse` - Checks whether the message breaks any of OpenAI's [usage policies](https://openai.com/policies/usage-policies). This step will only be performed if `disableModeration` is set to `false`. In Dry mode, this step will **not** be skipped if `apiKey` was specified, since this endpoint is free.
     * - `addUserMessage` - Adds a message with the role of "user" to the conversation's message history.
     * - `getChatCompletionResponse` - Sends the message history to OpenAI, including the previously added user message, and gets the assistant's response.
     * - `addAssistantMessage` - Adds the previously obtained response with the role of "assistant" to the conversation's message history.
     *
     * @param prompt The prompt to send to the assistant.
     * @param options Additional options to pass to the createChatCompletion request.
     * @returns The assistant's response, or `null` if the user's message was empty.
     */
    public async prompt(
        prompt: string,
        options?: ChatCompletionRequestOptions
    ) {
        const userMessage = await this.addUserMessage(prompt);
        if (!userMessage) return null;

        try {
            const completion = await this.getChatCompletionResponse(options);
            if (!completion) {
                this.removeMessage(userMessage);
                return null;
            }

            const assistantMessage = await this.addAssistantMessage(completion);
            if (!assistantMessage) {
                this.removeMessage(userMessage);
                return null;
            }

            return assistantMessage.content;
        } catch (e) {
            this.removeMessage(userMessage);
            throw e;
        }
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
