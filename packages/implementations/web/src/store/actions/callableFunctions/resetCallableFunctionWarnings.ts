import { createAction } from "../createAction";

export const resetCallableFunctionWarnings = createAction(({ set }) => {
    set((state) => {
        state.showFunctionsWarning = true;
        state.showFunctionsImportWarning = true;
    });
}, "resetCallableFunctionWarnings");
