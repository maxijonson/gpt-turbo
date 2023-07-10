import { useAppStore } from "../..";
import { Settings } from "../../../entities/settings";

export const setDefaultSettings = (settings: Settings) => {
    useAppStore.setState((state) => {
        state.defaultSettings = settings;
    });
};
