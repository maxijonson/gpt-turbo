import { createAction } from "../createAction";

export const removeSavedPrompt = createAction(({ set }, promptName: string) => {
    set((state) => {
        state.savedPrompts = state.savedPrompts.filter(
            (prompt) => prompt.name !== promptName
        );
    });
}, "removeSavedPrompt");
