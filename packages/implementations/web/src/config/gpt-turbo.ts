import { Conversation } from "gpt-turbo";
import statsPlugin from "gpt-turbo-plugin-stats";

const globalPlugins = [statsPlugin];
Conversation.globalPlugins = [statsPlugin];
declare module "gpt-turbo" {
    export interface ConversationGlobalPluginsOverride {
        globalPlugins: typeof globalPlugins;
    }
}
