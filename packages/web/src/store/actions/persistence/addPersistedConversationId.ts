import { createAction } from "../createAction";

export const addPersistedConversationId = createAction(
    ({ set }, id: string) => {
        set((state) => {
            state.persistedConversationIds.push(id);
        });
    },
    "addPersistedConversationId"
);
