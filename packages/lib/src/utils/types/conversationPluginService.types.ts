import { ConversationPluginDefinition } from "./conversationPlugin.types.js";

export type PluginOutputFromName<
    TPlugin extends ConversationPluginDefinition,
    N extends TPlugin["name"]
> = TPlugin extends ConversationPluginDefinition<N, infer O> ? O : never;
