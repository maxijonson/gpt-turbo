import { AppPersistedState, AppState } from "..";
import { persistenceSchema } from "../../entities/persistence";

export const partializeStore = (state: AppState): AppPersistedState => {
    // App Settings
    const appSettings = persistenceSchema.shape.appSettings.parse({
        showUsage: state.showUsage,
        colorScheme: state.colorScheme,
    });

    // Callable Functions
    const callableFunctions = persistenceSchema.shape.callableFunctions.parse({
        functions: state.callableFunctions.map((fn) => {
            const displayName = state.callableFunctionDisplayNames[fn.id];
            const code = state.callableFunctionCodes[fn.id];
            return {
                ...fn.toJSON(),
                displayName,
                code,
            };
        }),
        showFunctionsWarning: state.showFunctionsWarning,
        showFunctionsImportWarning: state.showFunctionsImportWarning,
    });

    // Conversations
    const conversations = persistenceSchema.shape.conversations.parse(
        state.conversations
            .filter((c) => state.persistedConversationIds.includes(c.id))
            .filter((c) => c.getMessages().length > 0)
            .map((c) => {
                const lastEdited =
                    state.conversationLastEdits.get(c.id) ?? Date.now();
                const name = state.conversationNames.get(c.id) ?? "New Chat";
                return {
                    ...c.toJSON(),
                    lastEdited,
                    name,
                };
            })
    );

    // Default Settings
    const defaultSettings = persistenceSchema.shape.defaultSettings.parse(
        state.defaultSettings
    );

    // Saved Contexts
    const savedContexts = persistenceSchema.shape.savedContexts.parse(
        state.savedContexts
    );

    // Saved Prompts
    const savedPrompts = persistenceSchema.shape.savedPrompts.parse(
        state.savedPrompts
    );

    return persistenceSchema.parse({
        appSettings,
        callableFunctions,
        conversations,
        defaultSettings,
        savedContexts,
        savedPrompts,
    });
};
