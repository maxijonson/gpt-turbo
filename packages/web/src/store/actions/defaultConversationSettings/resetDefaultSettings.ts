import { useAppStore } from "../..";
import { initialDefaultConversationSettingsState } from "../../slices/defaultConversationSettingsSlice";

export const resetDefaultSettings = () => {
    useAppStore.setState((state) => {
        state.defaultSettings =
            initialDefaultConversationSettingsState.defaultSettings;
    });
};
