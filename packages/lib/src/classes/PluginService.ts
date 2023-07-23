import { ConversationModel } from "../schemas/conversation.schema.js";
import { ConversationCallableFunctionsModel } from "../schemas/conversationCallableFunctions.schema.js";
import { ConversationPlugin } from "./ConversationPlugin.js";

/**
 * Manages the plugins of a conversation and acts as a bridge between the plugins and the conversation.
 *
 * @internal
 * This class is used internally by the library and is not meant to be **instantiated** by consumers of the library.
 */
export class PluginService {
    private _hasInitialized = false;

    constructor(private readonly plugins: ConversationPlugin[] = []) {}

    /**
     * Gets a plugin instance of the specified type.
     *
     * @param pluginClass The plugin class to get.
     * @returns The plugin instance if found, otherwise `undefined`.
     */
    public getPlugin<T extends typeof ConversationPlugin>(pluginClass: T) {
        if (pluginClass === ConversationPlugin) return undefined;
        return this.plugins.find(
            (p): p is InstanceType<T> => p instanceof pluginClass
        );
    }

    public onInit(...args: Parameters<ConversationPlugin["onInit"]>) {
        this.plugins.forEach((p) => p.onInit(...args));
        this.onPostInit();
    }

    public onPostInit() {
        this.plugins.forEach((p) => p.onPostInit());
        this._hasInitialized = true;
    }

    public transformConversationModel(
        json: ConversationModel
    ): ConversationModel {
        return this.plugins.reduce(
            (json, p) => p.transformConversationModel(json),
            json
        );
    }

    public transformConversationCallableFunctionsModel(
        json: ConversationCallableFunctionsModel
    ): ConversationCallableFunctionsModel {
        return this.plugins.reduce(
            (json, p) => p.transformConversationCallableFunctionsModel(json),
            json
        );
    }

    public get hasInitialized() {
        return this._hasInitialized;
    }
}
