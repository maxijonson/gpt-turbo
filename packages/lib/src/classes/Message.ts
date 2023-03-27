import { v4 as uuid } from "uuid";
import { ChatCompletionRequestMessageRoleEnum, OpenAIApi } from "openai";
import { AxiosResponse } from "axios";
import { Stream } from "stream";
import { getMessageCost, getMessageSize } from "../index.js";

export type MessageUpdateListener = (content: string, message: Message) => void;
export type MessageStreamingListener = (
    isStreaming: boolean,
    message: Message
) => void;
export type MessageStreamingStartListener = (message: Message) => void;
export type MessageStreamingStopListener = (message: Message) => void;

export class Message {
    private _id = uuid();
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
     * @param role The role of who this message is from. Either "user", "assistant" or "system". Defaults to "user"
     * @param content The content of the message. Defaults to an empty string.
     * @param model The model used for processing this message. This is only used to calculate the cost of the message. Defaults to an empty string. If you don't specify a model, the `cost` will always be `0`.
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

    get id() {
        return this._id;
    }

    private set id(id) {
        this._id = id;
    }

    get role() {
        return this._role;
    }

    private set role(role) {
        this._role = role;
    }

    get model() {
        return this._model;
    }

    private set model(model) {
        this._model = model;
    }

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

    get flags() {
        return this._flags?.slice() ?? null;
    }

    private set flags(flags) {
        this._flags = flags;
    }

    get isFlagged() {
        return (this.flags?.length ?? 0) > 0;
    }

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

    get isStreaming() {
        return this._isStreaming;
    }

    private set isStreaming(isStreaming) {
        this._isStreaming = isStreaming;

        this.notifyMessageStreaming();
    }

    private notifyMessageUpdate() {
        const content = this.content;
        this.messageUpdateListeners.forEach((listener) =>
            listener(content, this)
        );
    }

    /**
     * Removes a message update listener, previously set with `onMessageUpdate`.
     *
     * @param listener The previously added listener
     */
    public offMessageUpdate(listener: MessageUpdateListener) {
        const index = this.messageUpdateListeners.indexOf(listener);
        if (index !== -1) this.messageUpdateListeners.splice(index, 1);
    }

    /**
     * Add a listener for message content changes
     *
     * @param listener The listener to trigger when `content` changes
     * @returns An unsubscribe function for this `listener`
     */
    public onMessageUpdate(listener: MessageUpdateListener) {
        this.messageUpdateListeners.push(listener);
        return () => this.offMessageUpdate(listener);
    }

    private notifyMessageStreaming() {
        const isStreaming = this.isStreaming;
        this.messageStreamingListeners.forEach((listener) =>
            listener(isStreaming, this)
        );
    }

    /**
     * Removes a message streaming listener, previously set with `onMessageStreamingUpdate`.
     *
     * @param listener The previously added listener
     */
    public offMessageStreaming(listener: MessageStreamingListener) {
        const index = this.messageStreamingListeners.indexOf(listener);
        if (index !== -1) this.messageStreamingListeners.splice(index, 1);
    }

    /**
     * Adds a listener for message streaming state changes
     *
     * @param listener The listener to trigger when `isStreaming` changes
     * @returns An unsubscribe function for this `listener`
     */
    public onMessageStreamingUpdate(listener: MessageStreamingListener) {
        this.messageStreamingListeners.push(listener);
        return () => this.offMessageStreaming(listener);
    }

    /**
     * Adds a listener for when the message receives a new token from the stream
     *
     * **Note: ** Internally, this creates a new function wrapping your passed `listener` and passes it to `onMessageStreamingUpdate`.
     * For this reason, you cannot remove a listener using `offMessageStreaming(listener)`.
     * Instead, use the returned function to unsubscribe the listener properly.
     *
     * @param listener The listener to trigger when receiving a new message token
     * @returns An unsubscribe function for this `listener`
     */
    public onMessageStreamReceive(listener: MessageStreamingStartListener) {
        const startListener: MessageStreamingListener = (
            isStreaming,
            message
        ) => isStreaming && listener(message);
        return this.onMessageStreamingUpdate(startListener);
    }

    /**
     * Adds a listener for message streaming stop
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
     * @param openai The OpenAIApi instance to use for moderation
     * @returns The flags applied on the message
     */
    public async moderate(openai: OpenAIApi): Promise<string[]> {
        const flags = this.flags;
        if (flags) {
            return flags;
        }

        const response = await openai.createModeration({
            input: this.content,
        });
        const { flagged, categories } = response.data.results[0];

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
     * @param response The AxiosResponse from the OpenAI API
     */
    public readContentFromStream(response: AxiosResponse) {
        const stream = response.data as unknown as Stream;
        let buffer = "";

        const listener = (chunk: any) => {
            this.isStreaming = true;
            buffer += chunk.toString();
            const payloadRegex = /^data: (.+)$/m;
            let match;

            while ((match = payloadRegex.exec(buffer))) {
                const payloadStr = match[1];
                const payload = JSON.parse(payloadStr);
                buffer = buffer.slice(match[0].length);

                const { role, content } = payload.choices[0].delta;
                if (!role && !content) {
                    stream.off("data", listener);
                    this.isStreaming = false;
                    break;
                } else {
                    if (!content) continue;
                    this.content += content;
                }
            }
        };

        stream.on("data", listener);

        stream.on("end", () => {
            this.isStreaming = false;
        });
    }
}
