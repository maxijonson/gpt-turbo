import { createAction } from "../createAction";

export const setConversationName = createAction(
    ({ set }, id: string, name: string) => {
        set((state) => {
            state.conversationNames.set(id, name);
        });
    },
    "setConversationName"
);
