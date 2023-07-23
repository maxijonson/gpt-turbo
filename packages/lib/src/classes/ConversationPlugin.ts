import { PluginNotInitializedException } from "../exceptions/PluginNotInitializedException.js";
import { ConversationModel } from "../schemas/conversation.schema.js";
import { ConversationCallableFunctionsModel } from "../schemas/conversationCallableFunctions.schema.js";
import { ConversationConfigModel } from "../schemas/conversationConfig.schema.js";
import { ConversationHistoryModel } from "../schemas/conversationHistory.schema.js";
import { ConversationRequestOptionsModel } from "../schemas/conversationRequestOptions.schema.js";
import { ChatCompletionService } from "./ChatCompletionService.js";
import { Conversation } from "./Conversation.js";
import { ConversationCallableFunctions } from "./ConversationCallableFunctions.js";
import { ConversationConfig } from "./ConversationConfig.js";
import { ConversationHistory } from "./ConversationHistory.js";
import { ConversationRequestOptions } from "./ConversationRequestOptions.js";
import type { ConversationPluginService } from "./ConversationPluginService.js";

/**
 * The base class for all conversation plugins. Plugins are used to extend the functionality of a conversation.
 */
export abstract class ConversationPlugin {
    private _conversation!: Conversation;
    private _config!: ConversationConfig;
    private _requestOptions!: ConversationRequestOptions;
    private _history!: ConversationHistory;
    private _callableFunctions!: ConversationCallableFunctions;
    private _chatCompletionService!: ChatCompletionService;
    private _pluginService!: ConversationPluginService;

    /**
     * Initializes the plugin's properties.
     *
     * @remarks
     * If you override this method, make sure to call `super.init()` at the **beginning** of your method to have access to the plugin's properties.
     */
    public onInit(
        conversation: Conversation,
        config: ConversationConfig,
        requestOptions: ConversationRequestOptions,
        history: ConversationHistory,
        callableFunctions: ConversationCallableFunctions,
        chatCompletionService: ChatCompletionService,
        pluginService: ConversationPluginService
    ) {
        this._conversation = conversation;
        this._config = config;
        this._requestOptions = requestOptions;
        this._history = history;
        this._callableFunctions = callableFunctions;
        this._chatCompletionService = chatCompletionService;
        this._pluginService = pluginService;
    }

    /**
     * Called after all plugins have been initialized. (directly after the `onInit` method is called on all plugins)
     *
     * @remarks
     * This could potentially be used to interop with other plugins.
     */
    public onPostInit() {}

    /**
     * Transform the `ConversationModel` returned by the `Conversation.toJSON` method.
     *
     * Must return a valid `ConversationModel`.
     * Model is validated using the `conversationSchema` **at the end** of all transformations.
     *
     * @param json The current `ConversationModel` that was generated by the library (or previous plugins)
     * @returns The new state of the `ConversationModel` to be returned by the `Conversation.toJSON` method.
     */
    public transformConversationJson(
        json: ConversationModel
    ): ConversationModel {
        return json;
    }

    /**
     * Transform the `ConversationCallableFunctionsModel` returned by the `ConversationCallableFunctions.toJSON` method.
     * Note that this is the model of the `ConversationCallableFunctions` class, not the `CallableFunction` class.
     *
     * Must return a valid `ConversationCallableFunctionsModel`.
     * Model is validated using the `conversationCallableFunctionsSchema` **at the end** of all transformations.
     *
     * @param json The current `ConversationCallableFunctionsModel` that was generated by the library (or previous plugins)
     * @returns The new state of the `ConversationCallableFunctionsModel` to be returned by the `ConversationCallableFunctions.toJSON` method.
     */
    public transformConversationCallableFunctionsJson(
        json: ConversationCallableFunctionsModel
    ): ConversationCallableFunctionsModel {
        return json;
    }

    /**
     * Transform the `ConversationConfigModel` returned by the `ConversationConfig.toJSON` method.
     *
     * Must return a valid `ConversationConfigModel`.
     * Model is validated using the `conversationConfigSchema` **at the end** of all transformations.
     *
     * @param json The current `ConversationConfigModel` that was generated by the library (or previous plugins)
     * @returns The new state of the `ConversationConfigModel` to be returned by the `ConversationConfig.toJSON` method.
     */
    public transformConversationConfigJson(
        json: ConversationConfigModel
    ): ConversationConfigModel {
        return json;
    }

    /**
     * Transform the `ConversationHistoryModel` returned by the `ConversationHistory.toJSON` method.
     *
     * Must return a valid `ConversationHistoryModel`.
     * Model is validated using the `conversationHistorySchema` **at the end** of all transformations.
     *
     * @param json The current `ConversationHistoryModel` that was generated by the library (or previous plugins)
     * @returns The new state of the `ConversationHistoryModel` to be returned by the `ConversationHistory.toJSON` method.
     */
    public transformConversationHistoryJson(
        json: ConversationHistoryModel
    ): ConversationHistoryModel {
        return json;
    }

    /**
     * Transform the `ConversationRequestOptionsModel` returned by the `ConversationRequestOptions.toJSON` method.
     *
     * Must return a valid `ConversationRequestOptionsModel`.
     * Model is validated using the `conversationRequestOptionsSchema` **at the end** of all transformations.
     *
     * @param json The current `ConversationRequestOptionsModel` that was generated by the library (or previous plugins)
     * @returns The new state of the `ConversationRequestOptionsModel` to be returned by the `ConversationRequestOptions.toJSON` method.
     */
    public transformConversationRequestOptionsJson(
        json: ConversationRequestOptionsModel
    ): ConversationRequestOptionsModel {
        return json;
    }

    /**
     * Returns the conversation the plugin is attached to.
     *
     * @throws {PluginNotInitializedException} Thrown if the plugin is not initialized. (i.e. Calling this method before the `init` method is called, such as in the constructor)
     */
    public get conversation() {
        if (!this._conversation) {
            throw new PluginNotInitializedException();
        }
        return this._conversation;
    }

    /**
     * Returns the conversation's config.
     *
     * @throws {PluginNotInitializedException} Thrown if the plugin is not initialized. (i.e. Calling this method before the `init` method is called, such as in the constructor)
     */
    public get config() {
        if (!this._config) {
            throw new PluginNotInitializedException();
        }
        return this._config;
    }

    /**
     * Returns the conversation's request options.
     *
     * @throws {PluginNotInitializedException} Thrown if the plugin is not initialized. (i.e. Calling this method before the `init` method is called, such as in the constructor)
     */
    public get requestOptions() {
        if (!this._requestOptions) {
            throw new PluginNotInitializedException();
        }
        return this._requestOptions;
    }

    /**
     * Returns the conversation's history.
     *
     * @throws {PluginNotInitializedException} Thrown if the plugin is not initialized. (i.e. Calling this method before the `init` method is called, such as in the constructor)
     */
    public get history() {
        if (!this._history) {
            throw new PluginNotInitializedException();
        }
        return this._history;
    }

    /**
     * Returns the conversation's callable functions.
     *
     * @throws {PluginNotInitializedException} Thrown if the plugin is not initialized. (i.e. Calling this method before the `init` method is called, such as in the constructor)
     */
    public get callableFunctions() {
        if (!this._callableFunctions) {
            throw new PluginNotInitializedException();
        }
        return this._callableFunctions;
    }

    /**
     * Returns the conversation's chat completion service.
     *
     * @throws {PluginNotInitializedException} Thrown if the plugin is not initialized. (i.e. Calling this method before the `init` method is called, such as in the constructor)
     */
    public get chatCompletionService() {
        if (!this._chatCompletionService) {
            throw new PluginNotInitializedException();
        }
        return this._chatCompletionService;
    }

    /**
     * Returns the conversation's plugin service
     *
     * @throws {PluginNotInitializedException} Thrown if the plugin is not initialized. (i.e. Calling this method before the `init` method is called, such as in the constructor)
     */
    public get pluginService() {
        if (!this._pluginService) {
            throw new PluginNotInitializedException();
        }
        return this._pluginService;
    }
}
