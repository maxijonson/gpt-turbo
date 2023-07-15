import { createAction } from "../createAction";

export const setActiveConversation = createAction(
    ({ get, set }, id: string | null, force = false) => {
        if (force) {
            set({ activeConversationId: id });
            return;
        }
        if (!id) {
            set({ activeConversationId: null });
            return;
        }

        const { conversations } = get();
        const conversation = conversations.find((c) => c.id === id);

        if (!conversation) {
            set({ activeConversationId: null });
            return;
        }

        set({ activeConversationId: id });
    },
    "setActiveConversation"
);
