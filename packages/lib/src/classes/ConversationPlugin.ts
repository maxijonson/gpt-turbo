import { PluginNotInitializedException } from "../exceptions/PluginNotInitializedException.js";
import { ConversationModel } from "../index.js";
import { ConversationCallableFunctionsModel } from "../schemas/conversationCallableFunctions.schema.js";
import { ChatCompletionService } from "./ChatCompletionService.js";
import { Conversation } from "./Conversation.js";
import { ConversationCallableFunctions } from "./ConversationCallableFunctions.js";
import { ConversationConfig } from "./ConversationConfig.js";
import { ConversationHistory } from "./ConversationHistory.js";
import { ConversationRequestOptions } from "./ConversationRequestOptions.js";
import type { PluginService } from "./PluginService.js";

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
    private _pluginService!: PluginService;

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
        pluginService: PluginService
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
     * Transform the conversation model before it is serialized.
     *
     * Must return a valid `ConversationModel`.
     *
     * @param json The current state of the conversation model that will be serialized.
     * @returns The new state of the conversation model to be serialized.
     */
    public transformConversationModel(
        json: ConversationModel
    ): ConversationModel {
        return json;
    }

    /**
     * Transform the callable functions model before it is serialized. Note that this is the model of the `ConversationCallableFunctions` class, not the `CallableFunction` class.
     *
     * Must return a valid `ConversationCallableFunctionsModel`.
     *
     * @param json The current state of the conversation model that will be serialized.
     * @returns The new state of the conversation model to be serialized.
     */
    public transformConversationCallableFunctionsModel(
        json: ConversationCallableFunctionsModel
    ): ConversationCallableFunctionsModel {
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
