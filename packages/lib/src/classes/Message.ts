import { v4 as uuid } from "uuid";
import {
    ChatCompletionRequestMessageRoleEnum,
    CreateChatCompletionStreamResponse,
    MessageStreamingListener,
    MessageStreamingStartListener,
    MessageStreamingStopListener,
    MessageUpdateListener,
    FunctionCallMessage,
    FunctionMessage,
    CompletionMessage,
    CreateChatCompletionMessage,
    CreateChatCompletionFunctionCallMessage,
    CreateChatCompletionFunctionMessage,
} from "../utils/types.js";
import { MessageModel, messageSchema } from "../schemas/message.schema.js";
import { ConversationRequestOptionsModel } from "../schemas/conversationRequestOptions.schema.js";
import createModeration from "../utils/createModeration.js";

/**
 * A message in a Conversation.
 */
export class Message {
    /**
     * A UUID generated for this message by the library.
     */
    public id = uuid();

    private _role!: ChatCompletionRequestMessageRoleEnum;
    private _model!: string;
    private _content!: string | null;
    private _name: string | undefined;
    private _functionCall:
        | {
              name: string;
              arguments: Record<string, any>;
          }
        | undefined;
    private _flags: string[] | null = null;
    private _isStreaming = false;

    private messageUpdateListeners: MessageUpdateListener[] = [];
    private messageStreamingListeners: MessageStreamingListener[] = [];

    /**
     * Creates a new Message instance.
     *
     * @param role The role of who this message is from. Either "user", "assistant" or "system".
     * @param content The content of the message.
     * @param model The model used for processing this message.
     */
    constructor(
        role: ChatCompletionRequestMessageRoleEnum = "user",
        content: string | null = "",
        model = ""
    ) {
        this.role = role;
        this.model = model;
        this.content = content;
    }

    /**
     * Creates a new `Message` instance from a serialized message.
     *
     * @param json The JSON object of the Message instance.
     * @returns A new `Message` instance
     */
    public static fromJSON(json: MessageModel): Message {
        const messageJson = messageSchema.parse(json);
        const message = new Message(
            messageJson.role,
            messageJson.content,
            messageJson.model
        );
        if (messageJson.id) message.id = messageJson.id;
        if (messageJson.flags) message.flags = messageJson.flags;
        return message;
    }

    /**
     * Serializes the message to JSON.
     *
     * @returns The `Message` as a JSON object.
     */
    public toJSON(): MessageModel {
        const json: MessageModel = {
            id: this.id,
            role: this.role,
            content: this.content,
            model: this.model,
            name: this._name,
            function_call: this._functionCall,
            flags: this.flags,
        };
        return messageSchema.parse(json);
    }

    /**
     * Removes a message update listener, previously set with `onMessageUpdate`.
     *
     * @param listener The previously added listener
     */
    public offMessageUpdate(listener: MessageUpdateListener) {
        this.messageUpdateListeners = this.messageUpdateListeners.filter(
            (l) => l !== listener
        );
    }

    /**
     * Add a listener for message content changes.
     *
     * @param listener The listener to trigger when `content` changes
     * @returns An unsubscribe function for this `listener`
     */
    public onMessageUpdate(listener: MessageUpdateListener) {
        this.messageUpdateListeners.push(listener);
        return () => this.offMessageUpdate(listener);
    }

    /**
     * Removes a message streaming listener, previously set with `onMessageStreamingUpdate`.
     *
     * @param listener The previously added listener
     */
    public offMessageStreaming(listener: MessageStreamingListener) {
        this.messageStreamingListeners = this.messageStreamingListeners.filter(
            (l) => l !== listener
        );
    }

    /**
     * Adds a listener for message streaming state changes.
     *
     * @param listener The listener to trigger when `isStreaming` changes
     * @returns An unsubscribe function for this `listener`
     */
    public onMessageStreamingUpdate(listener: MessageStreamingListener) {
        this.messageStreamingListeners.push(listener);
        return () => this.offMessageStreaming(listener);
    }

    /**
     * Adds a listener for message streaming start.
     *
     * **Note:** Internally, this creates a new function wrapping your passed `listener` and passes it to `onMessageStreamingUpdate`.
     * For this reason, you cannot remove a listener using `offMessageStreaming(listener)`.
     * Instead, use the returned function to unsubscribe the listener properly.
     *
     * @param listener The listener to trigger when `isStreaming` is set to `true`
     * @returns An unsubscribe function for this `listener`
     */
    public onMessageStreamingStart(listener: MessageStreamingStartListener) {
        const startListener: MessageStreamingListener = (
            isStreaming,
            message
        ) => isStreaming && listener(message);
        return this.onMessageStreamingUpdate(startListener);
    }

    /**
     * Adds a listener for message streaming stop.
     *
     * **Note: ** Internally, this creates a new function wrapping your passed `listener` and passes it to `onMessageStreamingUpdate`.
     * For this reason, you cannot remove a listener using `offMessageStreaming(listener)`.
     * Instead, use the returned function to unsubscribe the listener properly.
     *
     * @param listener The listener to trigger when `isStreaming` is set to `false`
     * @returns An unsubscribe function for this `listener`
     */
    public onMessageStreamingStop(listener: MessageStreamingStopListener) {
        const stopListener: MessageStreamingListener = (isStreaming, message) =>
            !isStreaming && listener(message);
        return this.onMessageStreamingUpdate(stopListener);
    }

    /**
     * Call the OpenAI moderation API to check if the message is flagged. Only called once for the same content.
     *
     * @param apiKey The OpenAI API key
     * @param requestOptions The request options to pass to fetch
     * @returns The flags applied on the message
     */
    public async moderate(
        apiKey: string,
        requestOptions: ConversationRequestOptionsModel = {}
    ): Promise<string[]> {
        const flags = this.flags;
        if (flags) {
            return flags;
        }
        if (!this.content) {
            this.flags = [];
            return this.flags;
        }

        const response = await createModeration(
            {
                apiKey,
                input: this.content,
            },
            requestOptions
        );
        const { flagged, categories } = response.results[0];

        this.flags = flagged
            ? Object.keys(categories).filter(
                  (category) => categories[category as keyof typeof categories]
              )
            : [];

        return this.flags;
    }

    /**
     * Progessively adds content to the message from a streamed response type.
     *
     * @param response The ReadableStream from the OpenAI API
     */
    public async readContentFromStream(response: ReadableStream) {
        try {
            this.isStreaming = true;
            const reader = response.getReader();
            const decoder = new TextDecoder();

            let functionCallName = "";
            let functionCallArguments = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const decoded = decoder.decode(value).trim();
                const chunks = decoded.split("data: ").filter((c) => c.trim());

                for (const chunk of chunks) {
                    try {
                        const json: CreateChatCompletionStreamResponse =
                            JSON.parse(chunk);
                        const content =
                            json?.choices?.[0]?.delta?.content ?? null;
                        const functionCall =
                            json?.choices?.[0]?.delta?.function_call ?? null;

                        if (functionCall) {
                            const { name, arguments: argsStr } = functionCall;
                            functionCallName += name ?? "";
                            functionCallArguments += argsStr ?? "";

                            let args = this.functionCall
                                ? { ...this.functionCall.arguments }
                                : {};
                            try {
                                args = JSON.parse(functionCallArguments);
                            } finally {
                                this.functionCall = {
                                    name: functionCallName,
                                    arguments: args,
                                };
                            }
                        } else {
                            if (!content) continue;
                            this.content += content;
                        }
                    } catch {
                        continue;
                    }
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            this.isStreaming = false;
        }
    }

    /**
     * Whether the message is a function call by the assistant
     */
    public isFunctionCall(): this is FunctionCallMessage {
        return (
            this.role === "assistant" &&
            this.content === null &&
            this.functionCall !== undefined
        );
    }

    /**
     * Whether the message is a function call result by the user
     */
    public isFunction(): this is FunctionMessage {
        return this.role === "function" && this.name !== undefined;
    }

    /**
     * Whether the message is a regular chat completion message
     */
    public isCompletion(): this is CompletionMessage {
        return (
            this.role !== "function" &&
            this.content !== null &&
            this.functionCall === undefined &&
            this.name === undefined
        );
    }

    private notifyMessageUpdate() {
        const content = this.content;
        this.messageUpdateListeners.forEach((listener) =>
            listener(content, this)
        );
    }

    private notifyMessageStreaming() {
        this.messageStreamingListeners.forEach((listener) => {
            listener(this.isStreaming, this);
        });
    }

    /** The role of who this message is from. */
    get role() {
        return this._role;
    }

    private set role(role) {
        this._role = role;
    }

    /** The model used to generate this message. */
    get model() {
        return this._model;
    }

    private set model(model) {
        this._model = model;
    }

    /** The content of the message. */
    get content() {
        return this._content;
    }

    set content(content) {
        this._content = content;
        this.flags = null;

        this.notifyMessageUpdate();
    }

    get name() {
        return this._name;
    }

    set name(name) {
        this._name = name;
    }

    get functionCall() {
        return this._functionCall;
    }

    set functionCall(functionCall) {
        this._functionCall = functionCall;
        this.flags = null;
        this.content = null; // also call notifyMessageUpdate() to notify listeners
    }

    /** The flags detected by OpenAI's moderation API. Only set after calling `moderate`. */
    get flags() {
        return this._flags?.slice() ?? null;
    }

    private set flags(flags) {
        this._flags = flags;
    }

    /** Whether the message is flagged by OpenAI's moderation API. Always `false` unless `moderate` has been called. */
    get isFlagged() {
        return (this.flags?.length ?? 0) > 0;
    }

    /** Whether the message is currently being streamed. */
    get isStreaming() {
        return this._isStreaming;
    }

    private set isStreaming(isStreaming) {
        this._isStreaming = isStreaming;

        this.notifyMessageStreaming();
    }

    /**
     * JSON definition of the message as consumed by OpenAI's API.
     */
    get chatCompletionMessage():
        | CreateChatCompletionMessage
        | CreateChatCompletionFunctionCallMessage
        | CreateChatCompletionFunctionMessage {
        if (this.isFunctionCall()) {
            return {
                role: this.role,
                content: this.content,
                function_call: {
                    name: this.functionCall.name,
                    arguments: JSON.stringify(this.functionCall.arguments),
                },
            } satisfies CreateChatCompletionFunctionCallMessage;
        }

        if (this.isFunction()) {
            return {
                content: this.content,
                name: this.name,
                role: this.role,
            } satisfies CreateChatCompletionFunctionMessage;
        }

        if (this.isCompletion()) {
            return {
                content: this.content,
                role: this.role,
            } satisfies CreateChatCompletionMessage;
        }

        throw new Error("Message type not recognized.");
    }
}
