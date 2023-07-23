import { PluginNotInitializedException } from "../exceptions/PluginNotInitializedException.js";
import { ChatCompletionService } from "./ChatCompletionService.js";
import { Conversation } from "./Conversation.js";
import { ConversationCallableFunctions } from "./ConversationCallableFunctions.js";
import { ConversationConfig } from "./ConversationConfig.js";
import { ConversationHistory } from "./ConversationHistory.js";
import { ConversationRequestOptions } from "./ConversationRequestOptions.js";
import type { PluginService } from "./PluginService.js";

export abstract class ConversationPlugin {
    private _conversation!: Conversation;
    private _config!: ConversationConfig;
    private _requestOptions!: ConversationRequestOptions;
    private _history!: ConversationHistory;
    private _callableFunctions!: ConversationCallableFunctions;
    private _chatCompletionService!: ChatCompletionService;
    private _pluginService!: PluginService;

    public init(
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

    public get conversation() {
        if (!this._conversation) {
            throw new PluginNotInitializedException();
        }
        return this._conversation;
    }

    public get config() {
        if (!this._config) {
            throw new PluginNotInitializedException();
        }
        return this._config;
    }

    public get requestOptions() {
        if (!this._requestOptions) {
            throw new PluginNotInitializedException();
        }
        return this._requestOptions;
    }

    public get history() {
        if (!this._history) {
            throw new PluginNotInitializedException();
        }
        return this._history;
    }

    public get callableFunctions() {
        if (!this._callableFunctions) {
            throw new PluginNotInitializedException();
        }
        return this._callableFunctions;
    }

    public get chatCompletionService() {
        if (!this._chatCompletionService) {
            throw new PluginNotInitializedException();
        }
        return this._chatCompletionService;
    }

    public get pluginService() {
        if (!this._pluginService) {
            throw new PluginNotInitializedException();
        }
        return this._pluginService;
    }
}
