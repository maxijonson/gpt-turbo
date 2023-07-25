import { createAction } from "../createAction";

export const setConversationLastEdit = createAction(
    ({ set }, id: string, lastEdit = Date.now()) => {
        set((state) => {
            state.conversationLastEdits.set(id, lastEdit);
        });
    },
    "setConversationLastEdit"
);
