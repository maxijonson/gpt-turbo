import { useAppStore } from "..";
import { STORAGE_PERSISTENCE_KEY } from "../../config/constants";
import { storeVersion } from "./migrations";
import { partializeStore } from "./partializeStore";
import { storeStorage } from "./storeStorage";

export const persistStore = () => {
    const state = useAppStore.getState();
    const persistedState = partializeStore(state);
    storeStorage.setItem(STORAGE_PERSISTENCE_KEY, {
        state: persistedState,
        version: storeVersion,
    });
};
