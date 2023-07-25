import { createAction } from "../createAction";

export const setLastChangelog = createAction(({ set }, value: string) => {
    set((state) => {
        state.lastChangelog = value;
    });
}, "setLastChangelog");
