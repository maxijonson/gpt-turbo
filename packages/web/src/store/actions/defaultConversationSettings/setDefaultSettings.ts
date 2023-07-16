import { PersistenceDefaultSettings } from "../../../entities/persistenceDefaultSettings";
import { createAction } from "../createAction";

export const setDefaultSettings = createAction(
    ({ set }, settings: PersistenceDefaultSettings) => {
        set((state) => {
            state.defaultSettings = settings;
        });
    },
    "setDefaultSettings"
);
