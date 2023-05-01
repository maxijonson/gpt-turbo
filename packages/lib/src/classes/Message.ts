import { v4 as uuid } from "uuid";
import { getMessageCost, getMessageSize } from "../index.js";
import {
    ChatCompletionRequestMessageRoleEnum,
    RequestOptions,
    CreateChatCompletionStreamResponse,
    MessageStreamingListener,
    MessageStreamingStartListener,
    MessageStreamingStopListener,
    MessageUpdateListener,
} from "../utils/types.js";
import createModeration from "../utils/createModeration.js";
import { MessageModel, messageSchema } from "../schemas/message.schema.js";

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
    private _content!: string;
    private _flags: string[] | null = null;
    private _size: number | null = null;
    private _cost: number | null = null;
    private _isStreaming = false;

    private messageUpdateListeners: MessageUpdateListener[] = [];
    private messageStreamingListeners: MessageStreamingListener[] = [];

    /**
     * Creates a new Message instance.
     *
     * @param role The role of who this message is from. Either "user", "assistant" or "system".
     * @param content The content of the message.
     * @param model The model used for processing this message. This is only used to calculate the cost of the message. If you don't specify a model, the `cost` will always be `0`.
     */
    constructor(
        role: ChatCompletionRequestMessageRoleEnum = "user",
        content = "",
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
        requestOptions: RequestOptions = {}
    ): Promise<string[]> {
        const flags = this.flags;
        if (flags) {
            return flags;
        }
        if (!this.content) return [];

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

                        if (!content) continue;
                        this.content += json.choices[0].delta.content;
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
        this.size = null;
        this.cost = null;

        this.notifyMessageUpdate();
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

    /** The size of the message's content, in tokens. */
    get size(): number {
        if (this._size) {
            return this._size;
        }
        const s = getMessageSize(this._content);
        this.size = s;
        return this._size as typeof s;
    }

    private set size(size: number | null) {
        this._size = size;
    }

    /** The estimated cost of the message's content. */
    get cost(): number {
        if (this._cost) {
            return this._cost;
        }
        const c = getMessageCost(
            this.size,
            this.model,
            this.role === "assistant" ? "completion" : "prompt"
        );
        this.cost = c;
        return this._cost as typeof c;
    }

    private set cost(cost: number | null) {
        this._cost = cost;
    }

    /** Whether the message is currently being streamed. */
    get isStreaming() {
        return this._isStreaming;
    }

    private set isStreaming(isStreaming) {
        this._isStreaming = isStreaming;

        this.notifyMessageStreaming();
    }
}
