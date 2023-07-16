import { createAction } from "../createAction";

export const saveContext = createAction(
    ({ set }, name: string, value: string) => {
        set((state) => {
            state.savedContexts.push({ name, value });
        });
    },
    "saveContext"
);
