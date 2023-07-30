import { createAction } from "../createAction";

export const removeAllSavedPrompts = createAction(({ set }) => {
    set((state) => {
        state.savedPrompts = [];
    });
}, "removeAllSavedPrompts");
