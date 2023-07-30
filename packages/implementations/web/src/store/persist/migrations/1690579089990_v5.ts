import { produce } from "immer";
import { StoreMigration } from ".";

export const migrationV5: StoreMigration = produce((persistedState) => {
    for (const conversation of persistedState.conversations) {
        // History
        conversation.history = {
            messages: conversation.messages,
        };
        conversation.messages = undefined;

        // Config
        conversation.config = conversation.config;

        // Callable functions
        conversation.callableFunctions = {
            functions: conversation.functions,
        };
        conversation.functions = undefined;

        // Request options
        conversation.requestOptions = conversation.requestOptions;

        // Plugins data
        conversation.pluginsData = {};
    }
});
