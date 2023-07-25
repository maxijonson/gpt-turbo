import { createAction } from "../createAction";

export const removeAllSavedContexts = createAction(({ set }) => {
    set((state) => {
        state.savedContexts = [];
    });
}, "removeAllSavedContexts");
