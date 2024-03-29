import { Message } from "./Message.js";
import { ConversationConfig } from "./ConversationConfig.js";
import {
    ConversationHistoryModel,
    conversationHistorySchema,
} from "../schemas/conversationHistory.schema.js";
import {
    AddMessageListener,
    RemoveMessageListener,
} from "../utils/types/index.js";
import { MessageRoleException } from "../exceptions/MessageRoleException.js";
import { EventManager } from "./EventManager.js";
import { ConversationPluginService } from "./ConversationPluginService.js";

/**
 * The request options for a conversation.
 *
 * @internal
 * This class is used internally by the library and is not meant to be **instantiated** by consumers of the library.
 */
export class ConversationHistory {
    private messages: Message[] = [];
    private addMessageEvents = new EventManager<AddMessageListener>();
    private removeMessageEvents = new EventManager<RemoveMessageListener>();

    public constructor(
        private readonly pluginService: ConversationPluginService,
        private readonly config: ConversationConfig,
        options: ConversationHistoryModel = {}
    ) {
        const { messages = [] } = options;

        if (config.context) {
            this.setContext(config.context);
        }

        for (const message of messages) {
            switch (message.role) {
                case "user":
                    if (message.content === null)
                        throw new Error("User message content cannot be null.");
                    this.addUserMessage(message.content);
                    break;
                case "assistant":
                    if (message.content === null) {
                        if (!message.function_call)
                            throw new Error("Function call must be provided.");
                        this.addFunctionCallMessage(message.function_call);
                    } else {
                        this.addAssistantMessage(message.content);
                    }
                    break;
                case "system":
                    if (message.content === null) continue;
                    this.setContext(message.content);
                    break;
                case "function":
                    if (!message.name)
                        throw new Error("Function name must be specified.");
                    if (message.content === null)
                        throw new Error(
                            "Function message content cannot be null."
                        );
                    this.addFunctionMessage(message.content, message.name);
                    break;
            }
        }
    }

    /**
     * Serializes the `ConversationHistory` to JSON.
     *
     * @returns A JSON representation of the `ConversationHistory` instance.
     *
     * @internal
     * This method is used internally by the library and is not meant to be used by consumers of the library.
     */
    public toJSON(): ConversationHistoryModel {
        // Config already has the context, so we don't need to add it here.
        const messages = this.getMessages();

        const json: ConversationHistoryModel = {
            messages:
                messages.length === 0
                    ? undefined
                    : messages.map((message) => message.toJSON()),
        };
        return conversationHistorySchema.parse(
            this.pluginService.transformConversationHistoryJson(json)
        );
    }

    /**
     * Adds a message to the conversation.
     *
     * @remarks
     * This method is mostly meant to be internal, but exposed for convenience.
     * You should use the `addAssistantMessage`, `addUserMessage`, `addFunctionCallMessage`, or `addFunctionMessage` methods when possible.
     *
     * @param message The message instance to add to the conversation.
     * @returns The added message.
     */
    public addMessage(message: Message) {
        if (message.isCompletion() || message.isFunction()) {
            message.content = message.content.trim();
        }

        if (!message.content && message.role === "user") {
            throw new Error("User message content cannot be empty.");
        }

        if (message.role === "system") {
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

        this.addMessageEvents.emit(message);
        return message;
    }

    /**
     * Adds a message with the role of `"assistant"` to the conversation.
     *
     * @param message The content of the message.
     * @returns The [Message](./utils/types.ts) object that was added to the conversation
     */
    public addAssistantMessage(message: string) {
        const assistantMessage = new Message(
            "assistant",
            message,
            this.config.model
        );
        if (!assistantMessage.isCompletion()) {
            throw new Error("Not a completion message.");
        }
        return this.addMessage(assistantMessage);
    }

    /**
     * Adds a message with the role of "user" to the conversation.
     *
     * @param message The content of the message.
     * @returns The [Message](./utils/types.ts) object that was added to the conversation
     */
    public addUserMessage(message: string) {
        const userMessage = new Message("user", message, this.config.model);
        if (!userMessage.isCompletion()) {
            throw new Error("Not a completion message.");
        }
        return this.addMessage(userMessage);
    }

    /**
     * Adds a message with the role of "assistant" to the conversation with the function call generated by the assistant.
     *
     * @param functionCall The name and arguments of the function to call, generated by the assistant.
     * @returns The [Message](./utils/types.ts) object that was added to the conversation
     */
    public addFunctionCallMessage(functionCall: {
        name: string;
        arguments: Record<string, any>;
    }) {
        const functionCallMessage = new Message(
            "assistant",
            null,
            this.config.model
        );
        functionCallMessage.functionCall = functionCall;
        if (!functionCallMessage.isFunctionCall()) {
            throw new Error("Not a function call message.");
        }
        return this.addMessage(functionCallMessage);
    }

    /**
     * Adds a message with the role of "function" to the conversation with the content being the return value of the function call, called by your own code.
     *
     * @param message The return value of the function call, stringified if needed.
     * @param name The name of the function that was called.
     * @returns The [Message](./utils/types.ts) object that was added to the conversation
     */
    public addFunctionMessage(message: string, name: string) {
        const functionMessage = new Message(
            "function",
            message,
            this.config.model
        );
        functionMessage.name = name;
        if (!functionMessage.isFunction()) {
            throw new Error("Not a function message.");
        }
        return this.addMessage(functionMessage);
    }

    /**
     * Sets the first message sent to the OpenAI API with the role of "system". This gives context the Chat Completion and can be used to customize its behavior.
     *
     * @param context The content of the system message.
     */
    public setContext(context: string) {
        this.addSystemMessage(context);
    }

    /**
     * Returns the context message content, if it is set.
     */
    public getContext() {
        const firstMessage = this.messages[0];
        if (!firstMessage) return null;
        if (firstMessage.role !== "system") return null;
        return firstMessage.content;
    }

    /**
     * Get the messages in the conversation.
     *
     * @param includeContext Whether to include the context message in the returned array.
     * @returns A **shallow copy** of the messages array.
     */
    public getMessages(includeContext = false) {
        if (!this.getContext()) return this.messages.slice(0);
        return includeContext ? this.messages.slice(0) : this.messages.slice(1);
    }

    /**
     * Clears all messages in the conversation except the context message, if it is set.
     */
    public clearMessages() {
        const context = this.getContext();
        this.messages.forEach((message) => this.removeMessage(message));
        if (context) {
            this.addSystemMessage(context);
        }
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
        this.removeMessageEvents.emit(removedMessage);
    }

    /**
     * Returns the messages in a format OpenAI's Chat Completion API can understand.
     */
    public getCreateChatCompletionMessages() {
        return this.messages.map((message) => message.chatCompletionMessage);
    }

    private addSystemMessage(message: string) {
        const systemMessage = new Message("system", message, this.config.model);
        return this.addMessage(systemMessage);
    }

    /**
     * Adds a listener function that is called whenever a message is added to the conversation.
     *
     * @param listener The function to call when a message is added to the conversation.
     * @returns A function that removes the listener from the list of listeners.
     */
    public onMessageAdded(listener: AddMessageListener) {
        return this.addMessageEvents.addListener(listener);
    }

    /**
     * Adds a listener function that is called only once whenever a message is added to the conversation.
     *
     * @param listener The function to call when a message is added to the conversation.
     * @returns A function that removes the listener from the list of listeners.
     */
    public onceMessageAdded(listener: AddMessageListener) {
        return this.addMessageEvents.once(listener);
    }

    /**
     * Removes a listener function from the list of listeners that was previously added with `onMessageAdded`.
     *
     * @param listener The function to remove from the list of listeners.
     */
    public offMessageAdded(listener: AddMessageListener) {
        return this.addMessageEvents.removeListener(listener);
    }

    /**
     * Adds a listener function that is called whenever a message is removed to the conversation.
     *
     * @param listener The function to call when a message is removed to the conversation.
     * @returns A function that removes the listener from the list of listeners.
     */
    public onMessageRemoved(listener: RemoveMessageListener) {
        return this.removeMessageEvents.addListener(listener);
    }

    /**
     * Adds a listener function that is called only once whenever a message is removed to the conversation.
     *
     * @param listener The function to call when a message is removed to the conversation.
     * @returns A function that removes the listener from the list of listeners.
     */
    public onceMessageRemoved(listener: RemoveMessageListener) {
        return this.removeMessageEvents.once(listener);
    }

    /**
     * Removes a listener function from the list of listeners that was previously added with `onMessageRemoved`.
     *
     * @param listener The function to remove from the list of listeners.
     */
    public offMessageRemoved(listener: RemoveMessageListener) {
        return this.removeMessageEvents.removeListener(listener);
    }
}
