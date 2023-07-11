import { StateCreator, create } from "zustand";
import { immer } from "zustand/middleware/immer";
import {
    AppSettingsState,
    createAppSettingsSlice,
} from "./slices/appSettingsSlice";
import {
    CallableFunctionsState,
    createCallableFunctionsSlice,
} from "./slices/callableFunctionsSlice";
import {
    ConversationsState,
    createConversationsSlice,
} from "./slices/conversationsSlice";
import {
    DefaultConversationSettingsState,
    createDefaultConversationSettingsSlice,
} from "./slices/defaultConversationSettingsSlice";
import {
    SavedContextsState,
    createSavedContextsSlice,
} from "./slices/savedContextsSlice";
import {
    SavedPromptsState,
    createSavedPromptsSlice,
} from "./slices/savedPromptsSlice";
import { enableMapSet } from "immer";
import {
    PersistenceState,
    createPersistenceSlice,
} from "./slices/persistenceSlice";

export type AppState = AppSettingsState &
    CallableFunctionsState &
    ConversationsState &
    DefaultConversationSettingsState &
    PersistenceState &
    SavedContextsState &
    SavedPromptsState;

export type AppStateSlice<T> = StateCreator<
    AppState,
    [["zustand/immer", never]],
    [],
    T
>;

enableMapSet();

export const useAppStore = create<AppState>()(
    immer((...a) => ({
        ...createAppSettingsSlice(...a),
        ...createCallableFunctionsSlice(...a),
        ...createConversationsSlice(...a),
        ...createDefaultConversationSettingsSlice(...a),
        ...createPersistenceSlice(...a),
        ...createSavedContextsSlice(...a),
        ...createSavedPromptsSlice(...a),
    }))
);
