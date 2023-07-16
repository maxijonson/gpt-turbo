import { initialDefaultConversationSettingsState } from "../../slices/defaultConversationSettingsSlice";
import { createAction } from "../createAction";

export const resetDefaultSettings = createAction(({ set }) => {
    set((state) => {
        state.defaultSettings =
            initialDefaultConversationSettingsState.defaultSettings;
    });
}, "resetDefaultSettings");
