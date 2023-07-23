import { ChatCompletionService } from "./ChatCompletionService.js";
import { Conversation } from "./Conversation.js";
import { ConversationCallableFunctions } from "./ConversationCallableFunctions.js";
import { ConversationConfig } from "./ConversationConfig.js";
import { ConversationHistory } from "./ConversationHistory.js";
import { ConversationPlugin } from "./ConversationPlugin.js";
import { ConversationRequestOptions } from "./ConversationRequestOptions.js";

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
            plugin.init(
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
