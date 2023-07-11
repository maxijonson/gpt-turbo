import { useAppStore } from "../..";
import { PersistenceDefaultSettings } from "../../../entities/persistenceDefaultSettings";

export const setDefaultSettings = (settings: PersistenceDefaultSettings) => {
    useAppStore.setState((state) => {
        state.defaultSettings = settings;
    });
};
