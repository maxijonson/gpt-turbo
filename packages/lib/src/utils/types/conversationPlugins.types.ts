import { ConversationPluginDefinition } from "./conversationPlugin.types.js";

type PluginOutputFromNameNonRecursive<
    TPlugin extends ConversationPluginDefinition,
    N extends string,
> = TPlugin extends ConversationPluginDefinition<N, infer O, infer _>
    ? O
    : never;

export type PluginOutputFromName<
    TPlugin extends ConversationPluginDefinition,
    N extends string,
> = PluginOutputFromNameNonRecursive<TPlugin, N> extends never
    ? any
    : PluginOutputFromNameNonRecursive<TPlugin, N>;

type PluginDataFromNameNonRecursive<
    TPlugin extends ConversationPluginDefinition,
    N extends string,
> = TPlugin extends ConversationPluginDefinition<N, infer _, infer D>
    ? D
    : never;

export type PluginDataFromName<
    TPlugin extends ConversationPluginDefinition,
    N extends string,
> = PluginDataFromNameNonRecursive<TPlugin, N> extends never
    ? any
    : PluginDataFromNameNonRecursive<TPlugin, N>;
