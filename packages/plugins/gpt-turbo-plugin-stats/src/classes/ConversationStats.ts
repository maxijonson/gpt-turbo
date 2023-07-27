import { ConversationHistory, Message } from "gpt-turbo";
import { MessageStats } from "./MessageStats.js";
import { StatsPluginData } from "../utils/types/index.js";

export class ConversationStats {
    private _cumulativeSize = 0;
    private _cumulativeCost = 0;

    private readonly messageStats = new Map<string, MessageStats>();

    constructor(
        private readonly history: ConversationHistory,
        options?: StatsPluginData
    ) {
        this._cumulativeSize = options?.cumulativeSize || 0;
        this._cumulativeCost = options?.cumulativeCost || 0;

        this.history
            .getMessages(true)
            .forEach((message) =>
                this.messageStats.set(message.id, new MessageStats(message))
            );
    }

    /**
     * Gets the stats for a message in the conversation history.
     *
     * @param id The message id to get stats for.
     * @returns The stats for the message with the given id.
     * @throws If the message with the given id is not found in the conversation history.
     */
    public getMessageStats(id: string) {
        const messageStats = this.messageStats.get(id);
        if (messageStats) return messageStats;

        const message = this.getMessageById(id);
        if (!message) {
            throw new Error(`Message ${id} not found`);
        }
        return this.createMessageStats(message);
    }

    /**
     * Shortcut for `getMessageStats(id).size`.
     */
    public getMessageSize(id: string) {
        return this.getMessageStats(id).size;
    }

    /**
     * Shortcut for `getMessageStats(id).cost`.
     */
    public getMessageCost(id: string) {
        return this.getMessageStats(id).cost;
    }

    /**
     * Increments the cumulative size and cost of the conversation by the size and cost of the given message and the current conversation size and cost.
     *
     * @internal
     * Only meant to be used by gpt-turbo.
     */
    public onChatCompletion(message: Message) {
        // FIXME: Find out how size/cost is calculated for function calls/messages
        if (!message.isCompletion()) return;
        const messageStats = this.createMessageStats(message);

        if (!message.isStreaming && message.content) {
            this.cumulativeSize += this.size + messageStats.size;
            this.cumulativeCost += this.cost + messageStats.cost;
            return;
        }

        this.cumulativeSize += this.size;
        this.cumulativeCost += this.cost;

        const offMessageSizeUpdate = messageStats.onUpdateSize((_, delta) => {
            this.cumulativeSize += delta;
        });
        const offMessageCostUpdate = messageStats.onUpdateCost((_, delta) => {
            this.cumulativeCost += delta;
        });

        message.onceStreamingStop(() => {
            offMessageSizeUpdate();
            offMessageCostUpdate();
        });
    }

    /**
     * Gets the plugin data for the `Conversation` instance.
     *
     * @internal
     * Only meant to be used by gpt-turbo.
     */
    public getPluginData(): StatsPluginData {
        return {
            cumulativeSize: this.cumulativeSize,
            cumulativeCost: this.cumulativeCost,
        };
    }

    /**
     * The current amount of tokens that the conversation contains.
     * This is the minimum amount of tokens that you will be charged for on your next prompt.
     *
     * @remarks
     * This is an estimate using the `gpt-tokenizer` library. Stats may vary with your actual usage of the API.
     */
    public get size() {
        return this.history
            .getMessages(true)
            .reduce((size, m) => size + this.getMessageSize(m.id), 0);
    }

    /**
     * The cumulative amount of tokens that were sent/received to/from the OpenAI API.
     *
     * @remarks
     * This is an estimate using the `gpt-tokenizer` library. Stats may vary with your actual usage of the API.
     */
    public get cumulativeSize() {
        return this._cumulativeSize;
    }

    private set cumulativeSize(value) {
        this._cumulativeSize = value;
    }

    /**
     * The current cost of the conversation.
     * This is the minimum amount of $USD that you will be charged for on your next prompt.
     *
     * @remarks
     * This is an estimate using the `gpt-tokenizer` library. Stats may vary with your actual usage of the API.
     */
    public get cost() {
        return this.history
            .getMessages(true)
            .reduce((cost, m) => cost + this.getMessageCost(m.id), 0);
    }

    /**
     * The cumulative cost of the conversation.
     * This is the total amount of $USD that you have been charged for the conversation so far.
     *
     * @remarks
     * This is an estimate using the `gpt-tokenizer` library. Stats may vary with your actual usage of the API.
     */
    public get cumulativeCost() {
        return this._cumulativeCost;
    }

    private set cumulativeCost(value) {
        this._cumulativeCost = value;
    }

    private createMessageStats(message: Message) {
        const existingMessageStats = this.messageStats.get(message.id);
        if (existingMessageStats) return existingMessageStats;

        const messageStats = new MessageStats(message);
        this.messageStats.set(message.id, messageStats);
        return messageStats;
    }

    private getMessageById(id: string) {
        return this.history.getMessages(true).find((m) => m.id === id);
    }
}
