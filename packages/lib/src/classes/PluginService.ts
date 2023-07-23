import { ChatCompletionService } from "./ChatCompletionService.js";
import { Conversation } from "./Conversation.js";
import { ConversationCallableFunctions } from "./ConversationCallableFunctions.js";
import { ConversationConfig } from "./ConversationConfig.js";
import { ConversationHistory } from "./ConversationHistory.js";
import { ConversationPlugin } from "./ConversationPlugin.js";
import { ConversationRequestOptions } from "./ConversationRequestOptions.js";

/**
 * Manages the plugins of a conversation and acts as a bridge between the plugins and the conversation.
 *
 * @internal
 * This class is used internally by the library and is not meant to be **instantiated** by consumers of the library.
 */
export class PluginService {
    constructor(
        conversation: Conversation,
        config: ConversationConfig,
        requestOptions: ConversationRequestOptions,
        history: ConversationHistory,
        callableFunctions: ConversationCallableFunctions,
        chatCompletionService: ChatCompletionService,
        private readonly plugins: ConversationPlugin[] = []
    ) {
        for (const plugin of plugins) {
            plugin.onInit(
                conversation,
                config,
                requestOptions,
                history,
                callableFunctions,
                chatCompletionService,
                this
            );
        }
    }

    public getPlugin<T extends typeof ConversationPlugin>(pluginClass: T) {
        if (pluginClass === ConversationPlugin) return undefined;
        return this.plugins.find(
            (p): p is InstanceType<T> => p instanceof pluginClass
        );
    }
}
