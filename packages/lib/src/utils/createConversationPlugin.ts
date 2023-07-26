import { ConversationPlugin, ConversationPluginData } from "./types/index.js";

/**
 * Convenience utility to create a conversation plugin with strict typing.
 *
 * This is the recommended way to create a type safe plugin, since it takes care of specifying generic exact type parameters of the `ConversationPlugin` interface.
 * For example, this will make your plugin appear in the intellisense of the `Conversation.getPlugin` method.
 *
 * Your can also type the generic parameters yourself, or even use the `ConversationPlugin` interface directly instead of this utility.
 *
 * @example
 * ```ts
 * // Since the "pluginData" parameter cannot be inferred by the returned definition, you must specify it yourself.
 * export default createConversationPlugin(({}, pluginData?: number) => {
    return {
        name: "example-plugin",
        getPluginData: () => 1,
        out: {} as StatsPluginOutput,
    };
});
 * ```
 *
 * @param plugin The plugin to create.
 * @returns A strictly typed plugin.
 */
export default <
    TName extends string,
    TOut = undefined,
    TData extends ConversationPluginData = undefined
>(
    plugin: ConversationPlugin<TName, TOut, TData>
) => plugin;
