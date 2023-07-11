import { StateCreator, create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { devtools, persist } from "zustand/middleware";
import {
    AppSettingsState,
    createAppSettingsSlice,
    initialAppSettingsState,
} from "./slices/appSettingsSlice";
import {
    CallableFunctionsState,
    createCallableFunctionsSlice,
    initialCallableFunctionsState,
} from "./slices/callableFunctionsSlice";
import {
    ConversationsState,
    createConversationsSlice,
    initialConversationsState,
} from "./slices/conversationsSlice";
import {
    DefaultConversationSettingsState,
    createDefaultConversationSettingsSlice,
    initialDefaultConversationSettingsState,
} from "./slices/defaultConversationSettingsSlice";
import {
    SavedContextsState,
    createSavedContextsSlice,
    initialSavedContextsState,
} from "./slices/savedContextsSlice";
import {
    SavedPromptsState,
    createSavedPromptsSlice,
    initialSavedPromptsState,
} from "./slices/savedPromptsSlice";
import { enableMapSet } from "immer";
import {
    PersistenceState,
    createPersistenceSlice,
    initialPersistenceState,
} from "./slices/persistenceSlice";
import { partializeStore } from "./persist/partializeStore";
import { storeStorage } from "./persist/storeStorage";

export type AppState = AppSettingsState &
    CallableFunctionsState &
    ConversationsState &
    DefaultConversationSettingsState &
    PersistenceState &
    SavedContextsState &
    SavedPromptsState;

export type AppPersistedState = unknown; // Typing this doesn't work and is recommended by Zustand to type as unknown

export type AppStateSlice<T> = StateCreator<
    AppState,
    [
        ["zustand/persist", AppPersistedState],
        ["zustand/immer", never],
        ["zustand/devtools", never]
    ],
    [],
    T
>;

export const initialAppState: AppState = {
    ...initialAppSettingsState,
    ...initialCallableFunctionsState,
    ...initialConversationsState,
    ...initialDefaultConversationSettingsState,
    ...initialPersistenceState,
    ...initialSavedContextsState,
    ...initialSavedPromptsState,
};

enableMapSet();

export const useAppStore = create<AppState>()(
    persist(
        immer(
            devtools(
                (...a) => ({
                    ...createAppSettingsSlice(...a),
                    ...createCallableFunctionsSlice(...a),
                    ...createConversationsSlice(...a),
                    ...createDefaultConversationSettingsSlice(...a),
                    ...createPersistenceSlice(...a),
                    ...createSavedContextsSlice(...a),
                    ...createSavedPromptsSlice(...a),
                }),
                { enabled: !import.meta.env.PROD }
            )
        ),
        {
            name: "gptturbo-persistence",
            partialize: partializeStore,
            storage: storeStorage,
        }
    )
);
