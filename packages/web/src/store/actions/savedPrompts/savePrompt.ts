import { createAction } from "../createAction";

export const savePrompt = createAction(
    ({ set }, name: string, value: string) => {
        set((state) => {
            state.savedPrompts.push({ name, value });
        });
    },
    "savePrompt"
);
