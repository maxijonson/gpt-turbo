import { ConversationHistory } from "gpt-turbo";
import { StatsPluginData, getMessageCost, getMessageSize } from "../index.js";

export class ConversationStats {
    private size = 0;
    private cost = 0;
    private cumulativeSize = 0;
    private cumulativeCost = 0;

    constructor(
        private readonly history: ConversationHistory,
        options?: StatsPluginData
    ) {
        this.cumulativeSize = options?.cumulativeSize || 0;
        this.cumulativeCost = options?.cumulativeCost || 0;

        this.size = this.history.getMessages(true).reduce((size, m) => {
            // FIXME: Find out how size is calculated for function calls/messages
            if (!m.isCompletion()) return size;
            return size + getMessageSize(m.content);
        }, 0);
        this.cost = this.history.getMessages(true).reduce((cost, m) => {
            // FIXME: Find out how cost is calculated for function calls/messages
            if (!m.isCompletion()) return cost;
            return (
                cost +
                getMessageCost(
                    m.content,
                    m.model,
                    m.role === "assistant" ? "completion" : "prompt"
                )
            );
        }, 0);
    }

    public getPluginData(): StatsPluginData {
        return {
            cumulativeSize: this.cumulativeSize,
            cumulativeCost: this.cumulativeCost,
        };
    }
}
