import { ConversationPlugin } from "../../classes/ConversationPlugin.js";
import { ConversationModel } from "../../index.js";

export interface ConversationOptions extends ConversationModel {
    /**
     * Plugins to be used in the conversation.
     *
     * Note that the order of the plugins is important. Each plugin are called in the order they are defined.
     */
    plugins?: ConversationPlugin[];
}
