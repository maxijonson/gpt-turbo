import { PersistStorage } from "zustand/middleware";
import { AppPersistedState } from "..";
import { storeVersion } from "./migrations";
import { parsePersistedState } from "./parsePersistedState";

export const storeStorage: PersistStorage<AppPersistedState> = {
    getItem: async (name) => {
        const value = localStorage.getItem(name);
        if (!value) return null;

        const json = JSON.parse(value);
        if (json.version !== storeVersion) return json;

        return {
            state: parsePersistedState(json.state),
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
