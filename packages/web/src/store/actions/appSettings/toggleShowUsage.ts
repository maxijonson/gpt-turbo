import { createAction } from "../createAction";

export const toggleShowUsage = createAction(({ set }, showUsage?: boolean) => {
    set((state) => {
        state.showUsage = showUsage ?? !state.showUsage;
    });
}, "toggleShowUsage");
