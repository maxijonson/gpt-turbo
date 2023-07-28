import {
    ConversationPluginDefinition,
    ConversationPluginDefinitionFromPlugin,
    createConversationPlugin,
} from "gpt-turbo";
import { ConversationStats } from "./classes/ConversationStats.js";
import { StatsPluginData } from "./utils/types/index.js";

/**
 * The name of the `statsPlugin`.
 */
export const statsPluginName = "gpt-turbo-plugin-stats" as const;

/**
 * The type of the plugin definition created by the `statsPlugin`.
 */
export type StatsPluginDefinition = ConversationPluginDefinitionFromPlugin<
    typeof statsPlugin
>;

/**
 * Type guard for the `statsPlugin`. Useful when using the `Conversation.getPlugin` method with a dynamic plugin name, preserving type safety.
 *
 * @example
 * ```ts
 * ["some-plugin", "some-other-plugin", "gpt-turbo-plugin-stats"].forEach(
 *     (pluginName) => {
 *         const plugin = conversation.plugins.safeGetPlugin(pluginName);
 *         if (isStatsPlugin(plugin)) {
 *             // plugin is now typed as StatsPlugin
 *             plugin.out.getMessageStats(...);
 *         }
 *     }
 * );
 * ```
 *
 * @param plugin The plugin to check.
 * @returns Whether the plugin is a `statsPlugin`.
 */
export const isStatsPlugin = (
    plugin?: ConversationPluginDefinition<any, any, any>
): plugin is StatsPluginDefinition => plugin?.name === statsPluginName;

/**
 * GPT Turbo plugin that calculates and stores statistics about the conversation.
 *
 * @example
 * ```ts
 * import { Conversation } from "gpt-turbo";
 * import stats from "gpt-turbo-plugin-stats";
 *
 * const conversation = new Conversation({
 *    plugins: [stats],
 * });
 * ```
 */
const statsPlugin = createConversationPlugin(
    statsPluginName,
    ({ history }, pluginData?: StatsPluginData) => {
        const conversationStats = new ConversationStats(history, pluginData);

        return {
            getPluginData: () => conversationStats.getPluginData(),
            onChatCompletion: (...args) =>
                conversationStats.onChatCompletion(...args),
            out: conversationStats,
        };
    }
);

export * from "./utils/index.js";
export * from "./classes/index.js";
export * from "./config/index.js";
export default statsPlugin;
