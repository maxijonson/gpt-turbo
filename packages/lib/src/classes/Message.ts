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
    MessageContentStreamListener,
} from "../utils/types/index.js";
import { MessageModel, messageSchema } from "../schemas/message.schema.js";
import { ConversationRequestOptionsModel } from "../schemas/conversationRequestOptions.schema.js";
import createModeration from "../utils/createModeration.js";
import { EventManager } from "./EventManager.js";

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

    private messageUpdateEvents = new EventManager<MessageUpdateListener>();
    private messageStreamingEvents =
        new EventManager<MessageStreamingListener>();
    private messageStreamingStartEvents =
        new EventManager<MessageStreamingStartListener>();
    private messageStreamingStopEvents =
        new EventManager<MessageStreamingStopListener>();
    private messageContentStreamEvents =
        new EventManager<MessageContentStreamListener>();

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

        this.messageUpdateEvents.emit(content, this);
        if (this.isStreaming) {
            this.messageContentStreamEvents.emit(
                content,
                this.isStreaming,
                this
            );
        }
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
        if (this._isStreaming === isStreaming) return;
        this._isStreaming = isStreaming;

        this.messageStreamingEvents.emit(isStreaming, this);
        isStreaming
            ? this.messageStreamingStartEvents.emit(this)
            : this.messageStreamingStopEvents.emit(this);

        this.messageContentStreamEvents.emit(this.content, isStreaming, this);
        if (!isStreaming) {
            this.messageContentStreamEvents.clear();
        }
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

    /**
     * Add a listener for message content changes.
     *
     * @param listener The listener to trigger when `content` changes
     * @returns An unsubscribe function for this `listener`
     */
    public onUpdate(listener: MessageUpdateListener) {
        return this.messageUpdateEvents.addListener(listener);
    }

    /**
     * Add a listener that is called only once when the message content changes.
     *
     * @param listener The listener to trigger when `content` changes
     * @returns An unsubscribe function for this `listener`
     */
    public onceUpdate(listener: MessageUpdateListener) {
        return this.messageUpdateEvents.once(listener);
    }

    /**
     * Removes a message update listener, previously set with `onUpdate`.
     *
     * @param listener The previously added listener
     */
    public offUpdate(listener: MessageUpdateListener) {
        return this.messageUpdateEvents.removeListener(listener);
    }

    /**
     * Adds a listener for message streaming state changes.
     *
     * @param listener The listener to trigger when `isStreaming` changes
     * @returns An unsubscribe function for this `listener`
     */
    public onStreamingUpdate(listener: MessageStreamingListener) {
        return this.messageStreamingEvents.addListener(listener);
    }

    /**
     * Adds a listener that is called only once when the message streaming state changes.
     *
     * @param listener The listener to trigger when `isStreaming` changes
     * @returns An unsubscribe function for this `listener`
     */
    public onceStreamingUpdate(listener: MessageStreamingListener) {
        return this.messageStreamingEvents.once(listener);
    }

    /**
     * Removes a message streaming listener, previously set with `onStreamingUpdate`.
     *
     * @param listener The previously added listener
     */
    public offStreaming(listener: MessageStreamingListener) {
        return this.messageStreamingEvents.removeListener(listener);
    }

    /**
     * Adds a listener for message streaming start.
     *
     * @param listener The listener to trigger when `isStreaming` is set to `true`
     * @returns An unsubscribe function for this `listener`
     */
    public onStreamingStart(listener: MessageStreamingStartListener) {
        return this.messageStreamingStartEvents.addListener(listener);
    }

    /**
     * Adds a listener that is called only once when the message streaming starts.
     *
     * @param listener The listener to trigger when `isStreaming` is set to `true`
     * @returns An unsubscribe function for this `listener`
     */
    public onceStreamingStart(listener: MessageStreamingStartListener) {
        return this.messageStreamingStartEvents.once(listener);
    }

    /**
     * Removes a message streaming start listener, previously set with `onStreamingStart`.
     *
     * @param listener The previously added listener
     */
    public offStreamingStart(listener: MessageStreamingStartListener) {
        return this.messageStreamingStartEvents.removeListener(listener);
    }

    /**
     * Adds a listener for message streaming stop.
     *
     * @param listener The listener to trigger when `isStreaming` is set to `false`
     * @returns An unsubscribe function for this `listener`
     */
    public onStreamingStop(listener: MessageStreamingStopListener) {
        return this.messageStreamingStopEvents.addListener(listener);
    }

    /**
     * Adds a listener that is called only once when the message streaming stops.
     *
     * @param listener The listener to trigger when `isStreaming` is set to `false`
     * @returns An unsubscribe function for this `listener`
     */
    public onceStreamingStop(listener: MessageStreamingStopListener) {
        return this.messageStreamingStopEvents.once(listener);
    }

    /**
     * Removes a message streaming stop listener, previously set with `onStreamingStop`.
     *
     * @param listener The previously added listener
     */
    public offStreamingStop(listener: MessageStreamingStopListener) {
        return this.messageStreamingStopEvents.removeListener(listener);
    }

    /**
     * Adds a listener that is fired whenever the message content is updated during streaming. Also fires when streaming starts/ends.
     *
     * @remarks
     * Unlike the other listeners which behave like normal event listeners, this special listener is unsubscribed automatically when streaming ends.
     * If this is not desired, use `onUpdate` and `onStreamingStart`/`onStreamingStop` instead.
     *
     * @param listener The listener to trigger when `content` changes during streaming
     * @returns An unsubscribe function for this `listener`
     */
    public onContentStream(listener: MessageContentStreamListener) {
        return this.messageContentStreamEvents.addListener(listener);
    }

    /**
     * Adds a listener that is fired only once whenever the message content is updated during streaming. Also fires when streaming starts/ends.
     *
     * @remarks
     * Unlike the other listeners which behave like normal event listeners, this special listener is unsubscribed automatically when streaming ends, regardless of whether it was called once or not.
     * If this is not desired, use `onceUpdate` and `onceStreamingStart`/`onceStreamingStop` instead.
     *
     * @param listener The listener to trigger when `content` changes during streaming
     * @returns An unsubscribe function for this `listener`
     */
    public onceContentStream(listener: MessageContentStreamListener) {
        return this.messageContentStreamEvents.once(listener);
    }

    /**
     * Removes a message streaming content listener, previously set with `onContentStream`.
     *
     * @remarks
     * You do not need to call this method manually, as this listener automatically unsubscribes all listeners when streaming ends.
     * You should use this if you want to unsubscribe a listener before streaming ends.
     *
     * @param listener The previously added listener
     */
    public offContentStream(listener: MessageContentStreamListener) {
        return this.messageContentStreamEvents.removeListener(listener);
    }
}
