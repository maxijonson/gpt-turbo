import { createAction } from "../createAction";

export const dismissFunctionsWarning = createAction(({ set }) => {
    set({ showFunctionsWarning: false });
}, "dismissFunctionsWarning");
