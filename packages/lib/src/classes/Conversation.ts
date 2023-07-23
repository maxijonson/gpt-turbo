import { ConversationConfig } from "./ConversationConfig.js";
import { Message } from "./Message.js";
import { v4 as uuid } from "uuid";
import {
    ConversationModel,
    conversationSchema,
} from "../schemas/conversation.schema.js";
import { ConversationRequestOptions } from "./ConversationRequestOptions.js";
import { ConversationHistory } from "./ConversationHistory.js";
import { ConversationCallableFunctions } from "./ConversationCallableFunctions.js";
import { ConversationRequestOptionsModel } from "schemas/conversationRequestOptions.schema.js";
import { ChatCompletionService } from "./ChatCompletionService.js";
import { PromptOptions } from "../utils/types/index.js";

/**
 * A Conversation manages the messages sent to and from the OpenAI API and handles the logic for providing the message history to the API for each prompt.
 */
export class Conversation {
    /**
     * A UUID generated by the library for this conversation. Not the same as the conversation ID returned by the OpenAI API.
     */
    public id = uuid();

    public readonly config: ConversationConfig;
    public readonly requestOptions: ConversationRequestOptions;
    public readonly history: ConversationHistory;
    public readonly callableFunctions: ConversationCallableFunctions;

    private readonly chatCompletionService: ChatCompletionService;

    /**
     * Creates a new Conversation instance.
     *
     * @param options The options for the Conversation instance's configuration, request options, history, and callable functions.
     */
    constructor(options: ConversationModel = {}) {
        const { config, requestOptions, history, callableFunctions } = options;

        this.config = new ConversationConfig(config);
        this.requestOptions = new ConversationRequestOptions(requestOptions);
        this.history = new ConversationHistory(this.config, history);
        this.callableFunctions = new ConversationCallableFunctions(
            callableFunctions
        );

        this.chatCompletionService = new ChatCompletionService(
            this.config,
            this.requestOptions,
            this.history,
            this.callableFunctions
        );
    }

    /**
     * Creates a new Conversation instance from a JSON object.
     *
     * @param json The JSON object of the Conversation instance.
     * @returns The new Conversation instance.
     */
    public static fromJSON(json: ConversationModel) {
        return new Conversation(conversationSchema.parse(json));
    }

    /**
     * Serializes the `Conversation` to JSON.
     *
     * @returns A JSON representation of the `Conversation` instance.
     */
    public toJSON(): ConversationModel {
        const json: ConversationModel = {
            id: this.id,
            config: this.config.toJSON(),
            requestOptions: this.requestOptions.toJSON(),
            callableFunctions: this.callableFunctions.toJSON(),
            history: this.history.toJSON(),
        };
        return conversationSchema.parse(json);
    }

    /**
     * Sends a Create Chat Completion request to the OpenAI API using the current messages stored in the conversation's history.
     *
     * @param options Additional options to pass to the Create Chat Completion API endpoint. This overrides the config passed to the constructor.
     * @param requestOptions Additional options to pass for the HTTP request. This overrides the config passed to the constructor.
     * @returns A new [`Message`](./Message.js) instance with the role of "assistant" and the content set to the response from the OpenAI API. If the `stream` config option was set to `true`, the content will be progressively updated as the response is streamed from the API. Listen to the returned message's `onUpdate` event to get the updated content.
     */
    public async getChatCompletionResponse(
        ...args: Parameters<ChatCompletionService["getChatCompletionResponse"]>
    ) {
        return this.chatCompletionService.getChatCompletionResponse(...args);
    }

    /**
     * This is the **recommended** way to interact with the GPT model. It's a wrapper method around other public methods that handles the logic of adding a user message, sending a request to the OpenAI API, and adding the assistant's response.
     *
     * @param prompt The prompt to send to the assistant.
     * @param options Additional options to pass to the Create Chat Completion API endpoint. This overrides the config passed to the constructor.
     * @param requestOptions Additional options to pass for the HTTP request. This overrides the config passed to the constructor.
     * @returns The assistant's response as a [`Message`](./Message.js) instance.
     */
    public async prompt(
        prompt: string,
        options?: PromptOptions,
        requestOptions?: ConversationRequestOptionsModel
    ) {
        const userMessage = this.history.addUserMessage(prompt);

        try {
            await this.chatCompletionService.moderateMessage(userMessage);
            const assistantMessage =
                await this.chatCompletionService.getAssistantResponse(
                    options,
                    requestOptions
                );
            return assistantMessage;
        } catch (e) {
            this.history.removeMessage(userMessage);
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
     * @param options Additional options to pass to the Create Chat Completion API endpoint. This overrides the config passed to the constructor.
     * @param requestOptions Additional options to pass for the HTTP request. This overrides the config passed to the constructor.
     * @returns The assistant's response as a [`Message`](./Message.js) instance.
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
        requestOptions?: ConversationRequestOptionsModel
    ) {
        // Find the message to reprompt from
        const id =
            typeof fromMessage === "string" ? fromMessage : fromMessage.id;
        const messages = this.history.getMessages();
        const fromIndex = messages.findIndex((m) => m.id === id);
        if (fromIndex === -1) {
            throw new Error(`Message with ID "${id}" not found.`);
        }

        // Find the previous user message
        let previousUserMessageIndex = fromIndex;
        let previousUserMessage = messages[previousUserMessageIndex];
        while (previousUserMessage.role !== "user") {
            previousUserMessageIndex--;
            if (previousUserMessageIndex < 0) break;
            previousUserMessage = messages[previousUserMessageIndex];
        }
        if (previousUserMessage?.role !== "user") {
            throw new Error(
                `Could not find a previous user message to reprompt from (${id}).`
            );
        }

        // Remove all messages after the previous user message
        messages
            .slice(previousUserMessageIndex + 1)
            .forEach((m) => this.history.removeMessage(m));

        try {
            // Edit the previous user message if needed
            if (newPrompt) {
                previousUserMessage.content = newPrompt;
                await this.chatCompletionService.moderateMessage(
                    previousUserMessage
                );
            }

            // Get the new assistant response
            const assistantMessage =
                await this.chatCompletionService.getAssistantResponse(
                    options,
                    requestOptions
                );
            return assistantMessage;
        } catch (e) {
            this.history.removeMessage(previousUserMessage);
            throw e;
        }
    }

    /**
     * Sends the result of a user-evaluated function call to the GPT model and gets the assistant's response.
     * This method should usually be called after receiving a function_call message from the assistant (using `getChatCompletionResponse()` or `prompt()`) and evaluating your own function with the provided arguments from that message.
     *
     * @param name The name of the function used to generate the result. This function must be defined in the `functions` config option.
     * @param result The result of the function call. If the result is anything other than a string, it will be JSON stringified. Since `result` can be anything, the `T` template is provided for your typing convenience, but is not used internally
     * @param options Additional options to pass to the Create Chat Completion API endpoint. This overrides the config passed to the constructor.
     * @param requestOptions Additional options to pass for the HTTP request. This overrides the config passed to the constructor.
     * @returns The assistant's response as a [`Message`](./Message.js) instance.
     */
    public async functionPrompt<T = any>(
        name: string,
        result: T,
        options?: PromptOptions,
        requestOptions?: ConversationRequestOptionsModel
    ) {
        const functionMessage = this.history.addFunctionMessage(
            typeof result === "string" ? result : JSON.stringify(result),
            name
        );

        try {
            await this.chatCompletionService.moderateMessage(functionMessage);
            const assistantMessage =
                await this.chatCompletionService.getAssistantResponse(
                    options,
                    requestOptions
                );
            return assistantMessage;
        } catch (e) {
            this.history.removeMessage(functionMessage);
            throw e;
        }
    }
}
