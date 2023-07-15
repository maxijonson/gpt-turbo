import { createAction } from "../createAction";

export const dismissFunctionsImportWarning = createAction(({ set }) => {
    set({ showFunctionsImportWarning: false });
}, "dismissFunctionsImportWarning");
