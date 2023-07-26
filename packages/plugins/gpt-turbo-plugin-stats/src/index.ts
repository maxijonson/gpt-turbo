import { createConversationPlugin } from "gpt-turbo";
import { ConversationStats } from "./classes/ConversationStats.js";
import { StatsPluginData } from "./utils/types.js";

export const statsPluginName = "gpt-turbo-plugin-stats" as const;
export * from "./utils/index.js";
export * from "./classes/index.js";
export * from "./config/index.js";

export default createConversationPlugin(
    ({ history }, pluginData?: StatsPluginData) => {
        const conversationStats = new ConversationStats(history, pluginData);

        return {
            name: statsPluginName,
            getPluginData: () => conversationStats.getPluginData(),
            out: conversationStats,
        };
    }
);
