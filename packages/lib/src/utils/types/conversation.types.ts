import { ConversationModel } from "../../schemas/conversation.schema.js";
import { ConversationPlugin } from "./conversationPlugin.types.js";

export interface ConversationOptions extends ConversationModel {
    /**
     * Plugins to be used in the conversation.
     *
     * Note that the order of the plugins is important. Each plugin are called in the order they are defined.
     */
    plugins?: ConversationPlugin[];
}

/**
 * Override this type in an interface to have type-safe global plugins. By default, `Conversation.globalPlugins` is of the general type `ConversationPlugin[]`.
 */
export interface ConversationGlobalPluginsOverride {}

/**
 * Specifies the type of the global plugins of a conversation.
 *
 * @internal
 * This type is used internally to determine the type of the global plugins of a conversation.
 * You're probably looking for `ConversationGlobalPluginsOverride` instead.
 */
export type ConversationGlobalPluginsOverwritten =
    ConversationGlobalPluginsOverride extends {
        globalPlugins: ConversationPlugin[];
    }
        ? ConversationGlobalPluginsOverride
        : { globalPlugins: ConversationPlugin[] };

/**
 * Specifies the type of the global plugins of a conversation.
 *
 * @internal
 * This type is used internally to determine the type of the global plugins of a conversation.
 * You're probably looking for `ConversationGlobalPlugins` instead.
 */
export type ConversationGlobalPlugins =
    ConversationGlobalPluginsOverwritten["globalPlugins"];

/**
 * Utility type to infer the type of the plugin names available in a list of plugins.
 *
 * @internal
 * This type is used internally to determine the type of the plugin names available in a conversation. It should have no use outside of the library.
 */
export type PluginNameFromPlugins<
    TPlugins extends ConversationPlugin[],
    TPlugin = TPlugins extends ConversationPlugin[] ? TPlugins[number] : string,
    TPluginDefinition = TPlugin extends ConversationPlugin
        ? ReturnType<TPlugin>
        : string
> = TPluginDefinition extends { name: infer U } ? U | (string & {}) : string; // (string & {}) is a neat trick to provide intellisense for U, while still allowing any string

/**
 * Utility type to infer the possible plugin names from the global plugins of a conversation.
 *
 * @internal
 * This type is used internally to determine the type of the plugin names available in a conversation. It should have no use outside of the library.
 */
export type GlobalPluginName = PluginNameFromPlugins<ConversationGlobalPlugins>;

/**
 * Utility type to infer the possible plugin names available in a conversation, based on the options passed to the conversation.
 *
 * @internal
 * This type is used internally to determine the type of the plugin names available in a conversation. It should have no use outside of the library.
 */
export type PluginNameFromConversationOptions<
    TOptions extends ConversationOptions
> = TOptions["plugins"] extends ConversationPlugin[]
    ? PluginNameFromPlugins<TOptions["plugins"]>
    : string;

/**
 * Utility type to infer the possible plugin names available in a conversation, based on the options passed to the conversation, as well as the global plugins.
 *
 * @internal
 * This type is used internally to determine the type of the plugin names available in a conversation. It should have no use outside of the library.
 */
export type PluginNameFromConversationOptionsWithGlobalPlugins<
    TOptions extends ConversationOptions
> = ConversationGlobalPluginsOverride extends {
    globalPlugins: ConversationPlugin[];
}
    ? TOptions["plugins"] extends ConversationPlugin[]
        ? PluginNameFromConversationOptions<TOptions> | GlobalPluginName
        : GlobalPluginName
    : PluginNameFromConversationOptions<TOptions> | (string & {});

export type PluginsFromConversationOptions<
    TOptions extends ConversationOptions
> = TOptions["plugins"] extends ConversationPlugin[]
    ? TOptions["plugins"]
    : ConversationPlugin[];

export type PluginsFromConversationOptionsWithGlobalPlugins<
    TOptions extends ConversationOptions
> = ConversationGlobalPluginsOverride extends {
    globalPlugins: ConversationPlugin[];
}
    ? PluginsFromConversationOptions<TOptions> | ConversationGlobalPlugins
    : PluginsFromConversationOptions<TOptions>;
