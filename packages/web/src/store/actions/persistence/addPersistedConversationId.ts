import { createAction } from "../createAction";

export const addPersistedConversationId = createAction(
    ({ set }, id: string) => {
        set((state) => {
            state.persistedConversationIds = state.persistedConversationIds
                .filter((persistedId) => persistedId !== id)
                .concat(id);
        });
    },
    "addPersistedConversationId"
);
