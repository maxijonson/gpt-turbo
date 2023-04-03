import {
    ConversationConfig,
    ConversationConfigParameters,
} from "./ConversationConfig.js";
import { createChatCompletion, getMessageSize } from "../utils/index.js";
import { ModerationException } from "../exceptions/ModerationException.js";
import { Message } from "./Message.js";
import { MessageRoleException } from "../exceptions/index.js";
import { v4 as uuid } from "uuid";
import {
    AddMessageListener,
    HandleChatCompletionOptions,
    PromptOptions,
    RemoveMessageListener,
    RequestOptions,
} from "../utils/types.js";

export class Conversation {
    public id = uuid();
    private config: ConversationConfig;
    private requestOptions: RequestOptions;
    private messages: Message[] = [];
    private addMessageListeners: AddMessageListener[] = [];
    private removeMessageListeners: RemoveMessageListener[] = [];
    private cumulativeSize = 0;
    private cumulativeCost = 0;

    constructor(
        config: ConversationConfigParameters = {},
        options: RequestOptions = {}
    ) {
        this.config = new ConversationConfig(config);
        this.requestOptions = options;
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

        if (!message.content && message.role === "user") {
            throw new Error("User message content cannot be empty.");
        }

        if (this.config.isModerationEnabled) {
            const flags = await message.moderate(
                this.config.apiKey,
                this.requestOptions
            );
            if (this.config.isModerationStrict && flags.length > 0) {
                throw new ModerationException(flags);
            }
        }

        if (message.role === "system") {
            this.config.context = message.content;
            if (message.content) {
                // Update the system message or add it if it doesn't exist.
                if (this.messages[0]?.role === "system") {
                    this.messages[0] = message;
                } else {
                    this.messages.unshift(message);
                }
            } else if (this.messages[0]?.role === "system") {
                // Remove the system message if it exists and the new content is empty.
                this.messages.shift();
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
        this.addMessageListeners = this.addMessageListeners.filter(
            (l) => l !== listener
        );
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
        this.removeMessageListeners = this.removeMessageListeners.filter(
            (l) => l !== listener
        );
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
        const removedMessage = this.messages.find((m) => m.id === id);
        if (!removedMessage) return;
        this.messages = this.messages.filter((m) => m.id !== id);
        this.notifyMessageRemoved(removedMessage);
    }

    private async handleStreamedResponse(
        options: HandleChatCompletionOptions = {},
        requestOptions: RequestOptions = {}
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

            createChatCompletion(
                {
                    ...this.config.chatCompletionConfig,
                    ...options,
                    stream: true,
                    messages,
                },
                {
                    ...this.requestOptions,
                    ...requestOptions,
                }
            ).then((response) => {
                // Using .then() to get the message out as soon as possible, since the content is known to be empty at first.
                // This gives time for client code to subscribe to the streaming events.
                message.readContentFromStream(response);
            });
        }

        return message;
    }

    private async handleNonStreamedResponse(
        options: HandleChatCompletionOptions = {},
        requestOptions: RequestOptions = {}
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
            const response = await createChatCompletion(
                {
                    ...this.config.chatCompletionConfig,
                    ...options,
                    stream: false,
                    messages,
                },
                {
                    ...this.requestOptions,
                    ...requestOptions,
                }
            );
            message.content = response.choices[0].message?.content ?? "";
        }

        this.cumulativeSize += this.getSize() + getMessageSize(message.content);
        this.cumulativeCost += this.getCost() + message.cost;

        return message;
    }

    /**
     * Fires a "createChatCompletion" request to the OpenAI API with the current messages.
     *
     * @param options Additional options to pass to the createChatCompletion request. This overrides the config passed to the constructor.
     * @param requestOptions Additional options to pass to the request. This overrides the config passed to the constructor.
     * @returns A new [`Message`](./Message.js) instance with the role of "assistant" and the content set to the response from the OpenAI API. If the `stream` config option was set to true, the content will be progressively updated, listen to changes with the `onMessageUpdate` event.
     */
    public async getChatCompletionResponse(
        options: HandleChatCompletionOptions = {},
        requestOptions: RequestOptions = {}
    ): Promise<Message> {
        return this.config.stream
            ? this.handleStreamedResponse(options, requestOptions)
            : this.handleNonStreamedResponse(options, requestOptions);
    }

    private async getAssistantResponse(
        options?: PromptOptions,
        requestOptions?: RequestOptions
    ) {
        const completion = await this.getChatCompletionResponse(
            options,
            requestOptions
        );
        if (!completion) {
            return null;
        }

        const assistantMessage = await this.addMessage(completion);
        if (!assistantMessage) {
            return null;
        }

        return assistantMessage;
    }

    /**
     * This is the **recommended** way to interact with the GPT model. It's a wrapper method around other public methods that handles the logic of adding a user message, sending a request to the OpenAI API, and adding the assistant's response.
     *
     * @param prompt The prompt to send to the assistant.
     * @param options Additional options to pass to the createChatCompletion request.
     * @param requestOptions Additional options to pass to the request. This overrides the config passed to the constructor.
     * @returns The assistant's response, or `null` if the user's message was empty.
     */
    public async prompt(
        prompt: string,
        options?: PromptOptions,
        requestOptions?: RequestOptions
    ) {
        const userMessage = await this.addUserMessage(prompt);
        if (!userMessage) return null;

        try {
            const assistantMessage = await this.getAssistantResponse(
                options,
                requestOptions
            );

            if (!assistantMessage) {
                this.removeMessage(userMessage);
                return null;
            }

            return assistantMessage;
        } catch (e) {
            this.removeMessage(userMessage);
            throw e;
        }
    }

    /**
     * Removes all messages starting from (but excluding) the `fromMessage` if it's a user message, or its previous user message if `fromMessage` is an assistant message.
     * Then, the `prompt` method is called using either the specified `newPrompt` or the previous user message's content.
     *
     * This is useful if you want to edit a previous user message (by specifying `newPrompt`) or if you want to regenerate the response to a previous user message (by not specifying `newPrompt`).
     *
     * @param fromMessage The message to re-prompt from. This can be either a message ID or a [`Message`](./Message.js) instance.
     * @param newPrompt The new prompt to use for the previous user message. If not provided, the previous user's message content will be reused.
     * @param options Additional options to pass to the createChatCompletion request.
     * @param requestOptions Additional options to pass to the request. This overrides the config passed to the constructor.
     * @returns The assistant's response, or `null` if the user's message was empty.
     *
     * @example
     * ```typescript
     * let assistantRes1 = await conversation.prompt("Hello!"); // Hi
     * let assistantRes2 = await conversation.prompt("How are you?"); // I'm good, how are you?
     *
     * // Regenerate the assistantRes2 response
     * assistantRes2 = await conversation.reprompt(assistantRes2); // Good! What about you?
     *
     * // Edit the initial prompt (and remove all messages after it. In this case, assistantRes2's response)
     * assistantRes1 = await conversation.reprompt(assistantRes1, "Goodbye!"); // See you later!
     * ```
     */
    public async reprompt(
        fromMessage: string | Message,
        newPrompt?: string,
        options?: PromptOptions,
        requestOptions?: RequestOptions
    ) {
        // Find the message to reprompt from
        const id =
            typeof fromMessage === "string" ? fromMessage : fromMessage.id;
        const fromIndex = this.messages.findIndex((m) => m.id === id);
        if (fromIndex === -1) {
            throw new Error(`Message with ID "${id}" not found.`);
        }
        const from = this.messages[fromIndex];

        // Find the previous user message
        const previousUserMessageIndex =
            from.role === "user" ? fromIndex : fromIndex - 1;
        const previousUserMessage = this.messages[previousUserMessageIndex];
        if (!previousUserMessage) {
            throw new Error(
                `Could not find a previous user message to reprompt from (${id}).`
            );
        }

        // Edit the previous user message if needed
        if (newPrompt) {
            previousUserMessage.content = newPrompt;
        }

        // Remove all messages after the previous user message
        this.messages
            .slice(previousUserMessageIndex + 1)
            .forEach((m) => this.removeMessage(m));

        try {
            // Get the new assistant response
            const assistantMessage = await this.getAssistantResponse(
                options,
                requestOptions
            );

            if (!assistantMessage) {
                this.removeMessage(previousUserMessage);
                return null;
            }

            return assistantMessage;
        } catch (e) {
            this.removeMessage(previousUserMessage);
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

    /**
     * Sets the context message at the beginning of the conversation.
     *
     * @param context The new context message.
     */
    public setContext(context: string) {
        this.addSystemMessage(context);
    }

    /**
     * Gets the current config properties.
     */
    public getConfig() {
        return {
            ...this.config.chatCompletionConfig,
            ...this.config.config,
        };
    }

    /**
     * Assigns a new config to the conversation.
     * Set the `merge` parameter to `true` to merge the new config with the existing config instead of replacing it.
     */
    public setConfig(config: ConversationConfigParameters, merge = false) {
        const newConfig = merge ? { ...this.getConfig(), ...config } : config;
        this.config = new ConversationConfig(newConfig);
        if (config.context) {
            this.setContext(config.context);
        }
    }
}
