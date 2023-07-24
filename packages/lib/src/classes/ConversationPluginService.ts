import { ConversationModel } from "../schemas/conversation.schema.js";
import { ConversationCallableFunctionsModel } from "../schemas/conversationCallableFunctions.schema.js";
import { ConversationConfigModel } from "../schemas/conversationConfig.schema.js";
import { ConversationHistoryModel } from "../schemas/conversationHistory.schema.js";
import { ConversationRequestOptionsModel } from "../schemas/conversationRequestOptions.schema.js";
import {
    ConversationPlugin,
    ConversationPluginDefinition,
    ConversationPluginProperties,
    PluginOutputFromName,
} from "../utils/types/index.js";

/**
 * Manages the plugins of a conversation and acts as a bridge between the plugins and the conversation.
 *
 * @remarks
 * Most of these methods are not documented (with TypeDocs).
 * In most cases, this is because they just call the equivalent method on each plugin.
 * Refer to the documentation of the `ConversationPluginDefinition` interface for their documentation.
 *
 * @internal
 * This class is used internally by the library and is not meant to be **instantiated** by consumers of the library.
 */
export class ConversationPluginService<
    TPluginCreators extends ConversationPlugin[] = ConversationPlugin[],
    TPlugin extends ConversationPluginDefinition = ReturnType<
        TPluginCreators[number]
    >
> {
    private _hasInitialized = false;
    private readonly plugins: ConversationPluginDefinition[] = [];

    constructor(private readonly pluginCreators: TPluginCreators) {}

    /**
     * Gets a `PluginDefinition` by its name.
     *
     * @param name The name of the plugin to get. (case-sensitive)
     * @returns The plugin with the specified name.
     * @throws If no plugin with the specified name is found.
     */
    public getPlugin<
        N extends TPlugin["name"],
        O extends TPlugin["out"] = PluginOutputFromName<
            TPlugin,
            N
        > extends never
            ? any
            : PluginOutputFromName<TPlugin, N>
    >(name: N) {
        const plugin = this.plugins.find((p) => p.name === name);
        if (!plugin) {
            throw new Error(`Plugin "${name}" not found.`);
        }
        return plugin as ConversationPluginDefinition<N, O>;
    }

    /**
     * Gets a `PluginDefinition`'s output by its name.
     *
     * @param name The name of the plugin to get. (case-sensitive)
     * @returns The output of the plugin with the specified name.
     * @throws If no plugin with the specified name is found.
     */
    public getPluginOutput<
        N extends TPlugin["name"],
        O extends TPlugin["out"] = PluginOutputFromName<
            TPlugin,
            N
        > extends never
            ? any
            : PluginOutputFromName<TPlugin, N>
    >(name: N) {
        const plugin = this.getPlugin(name);
        return plugin.out as O;
    }

    public onInit(properties: ConversationPluginProperties) {
        this.pluginCreators.forEach((p) => p(properties));
        this.onPostInit();
    }

    public onPostInit() {
        this.plugins.forEach((p) => p.onPostInit?.());
        this._hasInitialized = true;
    }

    public transformConversationJson(
        json: ConversationModel
    ): ConversationModel {
        return this.plugins.reduce(
            (json, p) => p.transformConversationJson?.(json) ?? json,
            json
        );
    }

    public transformConversationCallableFunctionsJson(
        json: ConversationCallableFunctionsModel
    ): ConversationCallableFunctionsModel {
        return this.plugins.reduce(
            (json, p) =>
                p.transformConversationCallableFunctionsJson?.(json) ?? json,
            json
        );
    }

    public transformConversationConfigJson(
        json: ConversationConfigModel
    ): ConversationConfigModel {
        return this.plugins.reduce(
            (json, p) => p.transformConversationConfigJson?.(json) ?? json,
            json
        );
    }

    public transformConversationHistoryJson(
        json: ConversationHistoryModel
    ): ConversationHistoryModel {
        return this.plugins.reduce(
            (json, p) => p.transformConversationHistoryJson?.(json) ?? json,
            json
        );
    }

    public transformConversationRequestOptionsJson(
        json: ConversationRequestOptionsModel
    ): ConversationRequestOptionsModel {
        return this.plugins.reduce(
            (json, p) =>
                p.transformConversationRequestOptionsJson?.(json) ?? json,
            json
        );
    }

    public get hasInitialized() {
        return this._hasInitialized;
    }
}
