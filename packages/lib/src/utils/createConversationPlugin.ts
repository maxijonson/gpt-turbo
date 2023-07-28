import {
    ConversationPlugin,
    ConversationPluginCreator,
    ConversationPluginData,
} from "./types/index.js";

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
 * export default createConversationPlugin("example-plugin", ({}, pluginData?: number) => {
    return {
        onPostInit: () => {},
        getPluginData: () => 1,
        out: {} as StatsPluginOutput,
    };
});
 * ```
 *
 * @param name A unique name for your plugin
 * @param creator A function that creates your plugin definition
 * @returns A conversation plugin that can be used in the `Conversation` constructor
 */
export default <
    TName extends string,
    TOut = undefined,
    TData extends ConversationPluginData = undefined
>(
    name: TName,
    creator: ConversationPluginCreator<TOut, TData>
) => {
    return { name, creator } as ConversationPlugin<TName, TOut, TData>;
};
