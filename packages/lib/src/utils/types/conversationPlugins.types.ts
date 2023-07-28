import { ConversationPluginCreatorDefinition } from "./conversationPlugin.types.js";

type PluginOutputFromNameNonRecursive<
    TPlugin extends ConversationPluginCreatorDefinition
> = TPlugin extends ConversationPluginCreatorDefinition<infer O, infer _>
    ? O
    : never;

export type PluginOutputFromName<
    TPlugin extends ConversationPluginCreatorDefinition
> = PluginOutputFromNameNonRecursive<TPlugin> extends never
    ? any
    : PluginOutputFromNameNonRecursive<TPlugin>;

type PluginDataFromNameNonRecursive<
    TPlugin extends ConversationPluginCreatorDefinition
> = TPlugin extends ConversationPluginCreatorDefinition<infer _, infer D>
    ? D
    : never;

export type PluginDataFromName<
    TPlugin extends ConversationPluginCreatorDefinition
> = PluginDataFromNameNonRecursive<TPlugin> extends never
    ? any
    : PluginDataFromNameNonRecursive<TPlugin>;
