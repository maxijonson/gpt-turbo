import { createAction } from "../createAction";
import { setActiveConversation } from "./setActiveConversation";

export const removeConversation = createAction(({ set }, id: string) => {
    set((state) => {
        state.conversations = state.conversations.filter(
            (conversation) => conversation.id !== id
        );

        state.conversationLastEdits.delete(id);
        state.conversationNames.delete(id);

        setActiveConversation(state.activeConversationId);
    });
}, "removeConversation");
