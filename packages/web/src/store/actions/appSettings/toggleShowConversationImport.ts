import { createAction } from "../createAction";

export const toggleShowConversationImport = createAction(
    ({ set }, showConversationImport?: boolean) => {
        set((state) => {
            state.showConversationImport =
                showConversationImport ?? !state.showConversationImport;
        });
    },
    "toggleShowConversationImport"
);
