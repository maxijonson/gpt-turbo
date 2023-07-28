import { ConversationModel } from "../schemas/conversation.schema.js";
import { ConversationCallableFunctionsModel } from "../schemas/conversationCallableFunctions.schema.js";
import { ConversationConfigModel } from "../schemas/conversationConfig.schema.js";
import { ConversationHistoryModel } from "../schemas/conversationHistory.schema.js";
import { ConversationRequestOptionsModel } from "../schemas/conversationRequestOptions.schema.js";
import {
    ConversationPlugin,
    ConversationPluginData,
    ConversationPluginDefinition,
    ConversationPluginProperties,
    PluginDataFromName,
    PluginOutputFromName,
} from "../utils/types/index.js";
import { Message } from "./Message.js";

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
    private plugins: ConversationPluginDefinition[] = [];

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
        O extends TPlugin["out"] = PluginOutputFromName<TPlugin, N>,
        D extends ConversationPluginData = PluginDataFromName<TPlugin, N>
    >(name: N) {
        const plugin = this.plugins.find((p) => p.name === name);
        if (!plugin) {
            throw new Error(`Plugin "${name}" not found.`);
        }
        return plugin as ConversationPluginDefinition<N, O, D>;
    }

    /**
     * Like `getPlugin`, but returns `undefined` instead of throwing an error if no plugin with the specified name is found.
     *
     * @param name The name of the plugin to get. (case-sensitive)
     * @returns The plugin with the specified name, or `undefined` if no plugin with the specified name is found.
     */
    public safeGetPlugin<N extends TPlugin["name"]>(name: N) {
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
    public getPluginOutput<
        N extends TPlugin["name"],
        O extends TPlugin["out"] = PluginOutputFromName<TPlugin, N>
    >(name: N) {
        const plugin = this.getPlugin(name);
        return plugin.out as O;
    }

    /**
     * Like `getPluginOutput`, but returns `undefined` instead of throwing an error if no plugin with the specified name is found.
     *
     * @param name The name of the plugin to get. (case-sensitive)
     * @returns The output of the plugin with the specified name, or `undefined` if no plugin with the specified name is found.
     */
    public safeGetPluginOutput<
        N extends TPlugin["name"],
        O extends TPlugin["out"] = PluginOutputFromName<TPlugin, N>
    >(name: N) {
        return this.safeGetPlugin(name)?.out as O | undefined;
    }

    public onInit(
        properties: ConversationPluginProperties,
        pluginsData?: ConversationModel["pluginsData"]
    ) {
        this.plugins = this.pluginCreators.map((p) =>
            p(properties, pluginsData?.[p.name])
        );
        this.onPostInit();
    }

    public onPostInit() {
        this.plugins.forEach((p) => p.onPostInit?.());
    }

    public transformConversationJson(json: ConversationModel) {
        return this.plugins.reduce(
            (json, p) => p.transformConversationJson?.(json) ?? json,
            json
        );
    }

    public transformConversationCallableFunctionsJson(
        json: ConversationCallableFunctionsModel
    ) {
        return this.plugins.reduce(
            (json, p) =>
                p.transformConversationCallableFunctionsJson?.(json) ?? json,
            json
        );
    }

    public transformConversationConfigJson(json: ConversationConfigModel) {
        return this.plugins.reduce(
            (json, p) => p.transformConversationConfigJson?.(json) ?? json,
            json
        );
    }

    public transformConversationHistoryJson(json: ConversationHistoryModel) {
        return this.plugins.reduce(
            (json, p) => p.transformConversationHistoryJson?.(json) ?? json,
            json
        );
    }

    public transformConversationRequestOptionsJson(
        json: ConversationRequestOptionsModel
    ) {
        return this.plugins.reduce(
            (json, p) =>
                p.transformConversationRequestOptionsJson?.(json) ?? json,
            json
        );
    }

    public async onUserPrompt(message: Message) {
        for (const plugin of this.plugins) {
            await plugin.onUserPrompt?.(message);
        }
    }

    public async onUserPromptError(error: unknown) {
        for (const plugin of this.plugins) {
            try {
                await plugin.onUserPromptError?.(error);
            } catch (e) {
                console.error(
                    `[gpt-turbo] Plugin "${plugin.name}" errored during "onUserPromptError":`
                );
                console.error(e);
            }
        }
    }

    public async onChatCompletion(message: Message) {
        for (const plugin of this.plugins) {
            await plugin.onChatCompletion?.(message);
        }
    }

    public async transformFunctionResult(result: any) {
        return this.plugins.reduce(
            async (result, p) =>
                p.transformFunctionResult?.(await result) ?? result,
            Promise.resolve(result)
        );
    }

    public async onFunctionPrompt(message: Message) {
        for (const plugin of this.plugins) {
            await plugin.onFunctionPrompt?.(message);
        }
    }

    public async onFunctionPromptError(error: unknown) {
        for (const plugin of this.plugins) {
            try {
                await plugin.onFunctionPromptError?.(error);
            } catch (e) {
                console.error(
                    `[gpt-turbo] Plugin "${plugin.name}" errored during "onFunctionPromptError":`
                );
                console.error(e);
            }
        }
    }

    public getPluginsData() {
        return this.plugins.reduce((data, p) => {
            if (p.getPluginData !== undefined) {
                data[p.name] = p.getPluginData();
            }
            return data;
        }, {} as Record<string, any>);
    }

    public async onModeration(message: Message) {
        for (const plugin of this.plugins) {
            await plugin.onModeration?.(message);
        }
    }
}
