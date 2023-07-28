import {
    ConversationPluginDefinition,
    ConversationPlugin,
    PluginDataFromName,
    PluginOutputFromName,
    ConversationPluginDefinitionFromPlugin,
} from "../utils/types/index.js";
import { ConversationPluginService } from "./ConversationPluginService.js";

/**
 * Provides methods to interact with the plugins of a conversation.
 * It is a bridge between client code and the `ConversationPluginService`, which is internal to the library.
 *
 * @internal
 * This class is used internally by the library and is not meant to be **instantiated** by consumers of the library.
 */
export class ConversationPlugins<
    TPluginCreators extends ConversationPlugin[] = ConversationPlugin[],
    TPlugin extends ConversationPluginDefinition = ConversationPluginDefinitionFromPlugin<
        TPluginCreators[number]
    >,
    TPluginName extends string = TPluginCreators[number]["name"] | (string & {})
> {
    constructor(
        private readonly pluginService: ConversationPluginService<TPluginCreators>
    ) {}

    /**
     * Gets a `PluginDefinition` by its name.
     *
     * @param name The name of the plugin to get. (case-sensitive)
     * @returns The plugin with the specified name.
     * @throws If no plugin with the specified name is found.
     */
    public getPlugin<N extends TPluginName>(name: N) {
        const plugin = this.plugins.find((p) => p.name === name);
        if (!plugin) {
            throw new Error(`Plugin "${name}" not found.`);
        }
        return plugin as ConversationPluginDefinition<
            N,
            PluginOutputFromName<TPlugin, N>,
            PluginDataFromName<TPlugin, N>
        >;
    }

    /**
     * Like `getPlugin`, but returns `undefined` instead of throwing an error if no plugin with the specified name is found.
     *
     * @param name The name of the plugin to get. (case-sensitive)
     * @returns The plugin with the specified name, or `undefined` if no plugin with the specified name is found.
     */
    public safeGetPlugin<N extends TPluginName>(name: N) {
        try {
            return this.getPlugin(name);
        } catch {
            return undefined;
        }
    }

    /**
     * Gets a `PluginDefinition`'s output by its name.
     *
     * @param name The name of the plugin to get. (case-sensitive)
     * @returns The output of the plugin with the specified name.
     * @throws If no plugin with the specified name is found.
     */
    public getPluginOutput<N extends TPluginName>(name: N) {
        const plugin = this.getPlugin(name);
        return plugin.out as PluginOutputFromName<TPlugin, N>;
    }

    /**
     * Like `getPluginOutput`, but returns `undefined` instead of throwing an error if no plugin with the specified name is found.
     *
     * @param name The name of the plugin to get. (case-sensitive)
     * @returns The output of the plugin with the specified name, or `undefined` if no plugin with the specified name is found.
     */
    public safeGetPluginOutput<N extends TPluginName>(name: N) {
        return this.safeGetPlugin(name)?.out as
            | PluginOutputFromName<TPlugin, N>
            | undefined;
    }

    /**
     * Gets all the **initialized** plugin definitions of the conversation.
     * These are different from the plugins passed to the `Conversation` constructor.
     *
     * @remarks
     * This is a shallow copy of the plugins array, so modifying the array will not modify the plugins of the conversation.
     */
    public getPlugins() {
        return this.plugins;
    }

    private get plugins() {
        return this.pluginService.getPlugins();
    }
}
