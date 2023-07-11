import { PersistStorage } from "zustand/middleware";
import { persistenceSchema } from "../../entities/persistence";
import { AppPersistedState, AppState, initialAppState } from "..";
import { CallableFunction, Conversation } from "gpt-turbo";

export const storeStorage: PersistStorage<AppPersistedState> = {
    getItem: async (name) => {
        const value = localStorage.getItem(name);
        if (!value) return null;

        const json = JSON.parse(value);
        const state: AppState = {
            ...initialAppState,
        };

        const persistence = persistenceSchema.parse(json.state);

        // App Settings
        const { appSettings } = persistence;
        state.showUsage = appSettings.showUsage;
        state.colorScheme = appSettings.colorScheme;

        // Callable Functions
        const { callableFunctions } = persistence;
        state.showFunctionsWarning = callableFunctions.showFunctionsWarning;
        state.showFunctionsImportWarning =
            callableFunctions.showFunctionsImportWarning;
        for (const {
            displayName,
            code,
            ...callableFunction
        } of callableFunctions.functions) {
            const fn = CallableFunction.fromJSON(callableFunction);
            state.callableFunctions.push(fn);
            state.callableFunctionDisplayNames[fn.id] = displayName;
            if (code) {
                state.callableFunctionCodes[fn.id] = code;
            }
        }

        // Conversations
        const { conversations } = persistence;
        for (const { lastEdited, name, ...conversation } of conversations) {
            const c = await Conversation.fromJSON({
                ...conversation,
                config: {
                    ...conversation.config,
                    apiKey: persistence.defaultSettings.apiKey,
                },
            });
            state.conversations.push(c);
            state.conversationNames.set(c.id, name);
            state.conversationLastEdits.set(c.id, lastEdited);
            state.persistedConversationIds.push(c.id);
        }

        // Default Settings
        const { defaultSettings } = persistence;
        state.defaultSettings = defaultSettings;

        // Saved Contexts
        const { savedContexts } = persistence;
        for (const savedContext of savedContexts) {
            state.savedContexts.push(savedContext);
        }

        // Saved Prompts
        const { savedPrompts } = persistence;
        for (const savedPrompt of savedPrompts) {
            state.savedPrompts.push(savedPrompt);
        }

        return {
            state,
            version: json.version,
        };
    },
    setItem: (name, value) => {
        localStorage.setItem(name, JSON.stringify(value));
    },
    removeItem: (name) => {
        localStorage.removeItem(name);
    },
};
