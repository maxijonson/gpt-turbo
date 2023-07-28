import { CallableFunction, Conversation } from "gpt-turbo";
import { AppState, initialAppState } from "..";
import { persistenceSchema } from "../../entities/persistence";
import { notifications } from "@mantine/notifications";

const notify = (title: string, message: string) => {
    // HACK: Gives time for Mantine to be initialized
    setTimeout(() => {
        notifications.show({ title, message, color: "red" });
    }, 100);
};

export const parsePersistedState = (persistedState: any) => {
    const state: AppState = {
        ...initialAppState,
    };

    const persistence = persistenceSchema.parse(persistedState);

    // App Settings
    const { appSettings } = persistence;
    state.showUsage = appSettings.showUsage;
    state.colorScheme = appSettings.colorScheme;
    state.lastChangelog = appSettings.lastChangelog;
    state.showConversationImport = appSettings.showConversationImport;

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
        try {
            const fn = CallableFunction.fromJSON(callableFunction);
            state.callableFunctions.push(fn);
            state.callableFunctionDisplayNames[fn.id] = displayName;
            if (code) {
                state.callableFunctionCodes[fn.id] = code;
            }
        } catch (e) {
            console.error(e);
            notify(
                "Error loading callable function",
                `Callable function "${displayName}" could not be loaded. It will be deleted. See console for more details.`
            );
            continue;
        }
    }

    // Conversations
    const { conversations } = persistence;
    for (const { lastEdited, name, ...conversation } of conversations) {
        try {
            const c = Conversation.fromJSON({
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
        } catch (e) {
            console.error(e);
            notify(
                "Error loading conversation",
                `Conversation "${name}" could not be loaded. It will be deleted. See console for more details.`
            );
            continue;
        }
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

    return state;
};
