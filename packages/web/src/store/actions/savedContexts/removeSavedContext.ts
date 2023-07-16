import { createAction } from "../createAction";

export const removeSavedContext = createAction(
    ({ set }, contextName: string) => {
        set((state) => {
            state.savedContexts = state.savedContexts.filter(
                (context) => context.name !== contextName
            );
        });
    },
    "removeSavedContext"
);
