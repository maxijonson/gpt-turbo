import {
    ConversationConfig,
    ConversationConfigParameters,
} from "./ConversationConfig.js";
import { OpenAIApi, CreateChatCompletionRequest } from "openai";
import { AxiosResponse } from "axios";
import { getMessageSize } from "../utils/index.js";
import { ModerationException } from "../exceptions/ModerationException.js";
import { Message } from "./Message.js";
import { MessageRoleException } from "../index.js";
import { v4 as uuid } from "uuid";

export type ChatCompletionRequestOptions = Omit<
    CreateChatCompletionRequest,
    "model" | "messages" | "stream"
>;
type OpenAiAxiosConfig = Omit<
    Parameters<OpenAIApi["createChatCompletion"]>[1],
    "responseType"
>;

export type AddMessageListener = (message: Message) => void;
export type RemoveMessageListener = (message: Message) => void;

export class Conversation {
    public id = uuid();
    private config: ConversationConfig;
    private axiosConfig: OpenAiAxiosConfig;
    private openai: OpenAIApi;
    private messages: Message[] = [];
    private addMessageListeners: AddMessageListener[] = [];
    private removeMessageListeners: RemoveMessageListener[] = [];
    private cumulativeSize = 0;
    private cumulativeCost = 0;

    constructor(
        config: ConversationConfigParameters,
        axiosConfig: OpenAiAxiosConfig = {}
    ) {
        this.config = new ConversationConfig(config);
        this.axiosConfig = axiosConfig;
        this.openai = new OpenAIApi(this.config);
        this.clearMessages();
    }

    private notifyMessageAdded(message: Message) {
        this.addMessageListeners.forEach((listener) => listener(message));
    }

    private notifyMessageRemoved(message: Message) {
        this.removeMessageListeners.forEach((listener) => listener(message));
    }

    private async addMessage(message: Message) {
        message.content = message.content.trim();

        if (this.config.isModerationEnabled) {
            const flags = await message.moderate(this.openai);
            if (this.config.isModerationStrict && flags.length > 0) {
                throw new ModerationException(flags);
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
            if (
                this.messages[this.messages.length - 1]?.role === message.role
            ) {
                throw new MessageRoleException();
            }
            this.messages.push(message);
        }

        this.notifyMessageAdded(message);
        return message;
    }

    private addSystemMessage(message: string) {
        const systemMessage = new Message("system", message, this.config.model);
        return this.addMessage(systemMessage);
    }

    /**
     * Adds a message with the role of "assistant" to the conversation.
     *
     * @param message The content of the message.
     * @returns The [Message](./utils/types.ts) object that was added to the conversation, or `null` if none was added (e.g. if the message was empty).
     */
    public addAssistantMessage(message: string) {
        const assistantMessage = new Message(
            "assistant",
            message,
            this.config.model
        );
        return this.addMessage(assistantMessage);
    }

    /**
     * Adds a message with the role of "user" to the conversation.
     *
     * @param message The content of the message.
     * @returns The [Message](./utils/types.ts) object that was added to the conversation, or `null` if none was added (e.g. if the message was empty).
     */
    public addUserMessage(message: string) {
        const userMessage = new Message("user", message, this.config.model);
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
    public removeMessage(message: string | Message) {
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

    private async handleStreamedResponse(
        options: ChatCompletionRequestOptions = {},
        axiosOptions: OpenAiAxiosConfig = {}
    ) {
        const message = new Message("assistant", "", this.config.model);
        const messages = this.messages.map(({ role, content }) => ({
            role,
            content,
        }));

        if (this.config.dry) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            message.content = messages[messages.length - 1]?.content ?? null;
        } else {
            const unsubscribeStreaming = message.onMessageStreamingStop((m) => {
                this.cumulativeSize +=
                    this.getSize() + getMessageSize(m.content);
                this.cumulativeCost += this.getCost() + m.cost;
                unsubscribeStreaming();
            });

            const response = await this.openai.createChatCompletion(
                {
                    ...options,
                    model: this.config.model,
                    stream: true,
                    messages,
                },
                {
                    ...this.axiosConfig,
                    ...axiosOptions,
                    responseType: "stream",
                }
            );
            message.readContentFromStream(response as AxiosResponse);
        }

        return message;
    }

    private async handleNonStreamedResponse(
        options: ChatCompletionRequestOptions = {},
        axiosOptions: OpenAiAxiosConfig = {}
    ) {
        const message = new Message("assistant", "", this.config.model);
        const messages = this.messages.map(({ role, content }) => ({
            role,
            content,
        }));

        if (this.config.dry) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            message.content = messages[messages.length - 1]?.content ?? null;
        } else {
            const response = await this.openai.createChatCompletion(
                {
                    ...options,
                    model: this.config.model,
                    stream: false,
                    messages,
                },
                {
                    ...this.axiosConfig,
                    ...axiosOptions,
                    responseType: "json",
                }
            );
            message.content = response.data.choices[0].message?.content ?? "";
        }

        this.cumulativeSize += this.getSize() + getMessageSize(message.content);
        this.cumulativeCost += this.getCost() + message.cost;

        return message;
    }

    /**
     * Fires a "createChatCompletion" request to the OpenAI API with the current messages.
     *
     * @param options Additional options to pass to the createChatCompletion request.
     * @param axiosOptions Additional options to pass to the axios request. This overrides the axios config passed to the constructor.
     * @returns A new [`Message`](./Message.js) object with the role of "assistant" and the content set to the response from the OpenAI API. If the `stream` config option was set to true, the content will be progressively updated, listen to changes with the `onMessageUpdate` event.
     */
    public async getChatCompletionResponse(
        options: ChatCompletionRequestOptions = {},
        axiosOptions: OpenAiAxiosConfig = {}
    ): Promise<Message> {
        return this.config.stream
            ? this.handleStreamedResponse(options, axiosOptions)
            : this.handleNonStreamedResponse(options, axiosOptions);
    }

    /**
     * This is the **recommended** way to interact with the GPT model. It's a wrapper method around other public methods that handles the logic of adding a user message, sending a request to the OpenAI API, and adding the assistant's response.
     *
     * @param prompt The prompt to send to the assistant.
     * @param options Additional options to pass to the createChatCompletion request.
     * @param axiosOptions Additional options to pass to the axios request. This overrides the axios config passed to the constructor.
     * @returns The assistant's response, or `null` if the user's message was empty.
     */
    public async prompt(
        prompt: string,
        options?: ChatCompletionRequestOptions,
        axiosOptions?: OpenAiAxiosConfig
    ) {
        const userMessage = await this.addUserMessage(prompt);
        if (!userMessage) return null;

        try {
            const completion = await this.getChatCompletionResponse(
                options,
                axiosOptions
            );
            if (!completion) {
                this.removeMessage(userMessage);
                return null;
            }

            const assistantMessage = await this.addMessage(completion);
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
        return this.messages.reduce((size, message) => size + message.size, 0);
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
        return this.messages.reduce((cost, message) => cost + message.cost, 0);
    }

    /**
     * Everytime a prompt is sent (using `prompt` or `getChatCompletionResponse`), the estimated cost of the conversation is added to an internal cumulative cost. This method returns this cumulative cost.
     */
    public getCumulativeCost() {
        return this.cumulativeCost;
    }
}
