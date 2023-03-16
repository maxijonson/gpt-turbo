import { v4 as uuid } from "uuid";
import { ChatCompletionRequestMessageRoleEnum, OpenAIApi } from "openai";
import { getMessageCost, getMessageSize } from "../index.js";

export class Message {
    private _id = uuid();
    private _role: ChatCompletionRequestMessageRoleEnum;
    private _content: string;
    private _flags: string[] | null = null;
    private _size: number | null = null;
    private _cost: number | null = null;

    constructor(role: ChatCompletionRequestMessageRoleEnum, content: string) {
        this._role = role;
        this._content = content;
    }

    get id() {
        return this._id;
    }

    get role() {
        return this._role;
    }

    get content() {
        return this._content;
    }

    set content(content) {
        this._content = content;
        this._flags = null;
        this._size = null;
        this._cost = null;
    }

    get flags() {
        return this._flags?.slice() ?? null;
    }

    get isFlagged() {
        return this._flags && this._flags.length > 0;
    }

    get size() {
        if (this._size) {
            return this._size;
        }
        const s = getMessageSize(this._content);
        this._size = s;
        return s;
    }

    get cost() {
        if (this._cost) {
            return this._cost;
        }
        const c = getMessageCost(this.size);
        this._cost = c;
        return c;
    }

    public async moderate(openai: OpenAIApi): Promise<string[]> {
        const flags = this.flags;
        if (flags) {
            return flags;
        }

        const response = await openai.createModeration({
            input: this._content,
        });
        const { flagged, categories } = response.data.results[0];

        this._flags = flagged
            ? Object.keys(categories).filter(
                  (category) => categories[category as keyof typeof categories]
              )
            : [];

        return this._flags.slice();
    }
}
