import { createAction } from "../createAction";

export const removeAllCallableFunctions = createAction(({ set }) => {
    set((state) => {
        state.callableFunctions = [];
        state.callableFunctionDisplayNames = {};
        state.callableFunctionCodes = {};
    });
}, "removeAllCallableFunctions");
