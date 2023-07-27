import { Message, EventManager } from "gpt-turbo";
import getMessageSize from "../utils/getMessageSize.js";
import getMessageCost from "../utils/getMessageCost.js";
import {
    MessageCostUpdateListener,
    MessageSizeUpdateListener,
} from "../utils/types/messageStats.types.js";

export class MessageStats {
    public readonly id: string;
    private _size = 0;
    private _cost = 0;
    private readonly messageSizeUpdateEvents =
        new EventManager<MessageSizeUpdateListener>();
    private readonly messageCostUpdateEvents =
        new EventManager<MessageCostUpdateListener>();

    constructor(private readonly message: Message) {
        this.id = message.id;
        this.update();
        message.onUpdate(this.update);
    }

    public get size() {
        return this._size;
    }

    private set size(size: number) {
        const delta = size - this._size;
        this._size = size;
        this.messageSizeUpdateEvents.emit(this._size, delta);
    }

    public get cost() {
        return this._cost;
    }

    private set cost(cost: number) {
        const delta = cost - this._cost;
        this._cost = cost;
        this.messageCostUpdateEvents.emit(this._cost, delta);
    }

    private update() {
        // FIXME: Find out how size/cost is calculated for function calls/messages
        if (!this.message.isCompletion()) return;
        this.size = getMessageSize(this.message.content);
        this.cost = getMessageCost(
            this.size,
            this.message.model,
            this.message.role === "assistant" ? "completion" : "prompt"
        );
    }

    public onUpdateSize(listener: MessageSizeUpdateListener) {
        return this.messageSizeUpdateEvents.addListener(listener);
    }

    public onceUpdateSize(listener: MessageSizeUpdateListener) {
        return this.messageSizeUpdateEvents.once(listener);
    }

    public offUpdateSize(listener: MessageSizeUpdateListener) {
        return this.messageSizeUpdateEvents.removeListener(listener);
    }

    public onUpdateCost(listener: MessageCostUpdateListener) {
        return this.messageCostUpdateEvents.addListener(listener);
    }

    public onceUpdateCost(listener: MessageCostUpdateListener) {
        return this.messageCostUpdateEvents.once(listener);
    }

    public offUpdateCost(listener: MessageCostUpdateListener) {
        return this.messageCostUpdateEvents.removeListener(listener);
    }
}
