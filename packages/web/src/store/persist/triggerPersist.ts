import { STORAGE_PERSISTENCE_KEY } from "../../config/constants";
import { createAction } from "../actions/createAction";
import { storeVersion } from "./migrations";
import { partializeStore } from "./partializeStore";
import { storeStorage } from "./storeStorage";

export const persistStore = createAction(({ get }) => {
    const state = get();
    const persistedState = partializeStore(state);
    storeStorage.setItem(STORAGE_PERSISTENCE_KEY, {
        state: persistedState,
        version: storeVersion,
    });
}, "persistStore");
