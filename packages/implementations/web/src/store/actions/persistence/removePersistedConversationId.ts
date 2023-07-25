import { createAction } from "../createAction";

export const removePersistedConversationId = createAction(
    ({ set }, id: string) => {
        set((state) => {
            state.persistedConversationIds =
                state.persistedConversationIds.filter(
                    (persistedId) => persistedId !== id
                );
        });
    },
    "removePersistedConversationId"
);
