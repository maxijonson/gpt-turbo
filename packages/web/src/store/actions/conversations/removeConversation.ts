import { useAppStore } from "../..";
import { setActiveConversation } from "./setActiveConversation";

export const removeConversation = (id: string) => {
    useAppStore.setState((state) => {
        state.conversations = state.conversations.filter(
            (conversation) => conversation.id !== id
        );

        state.conversationLastEdits.delete(id);
        state.conversationNames.delete(id);

        setActiveConversation(state.activeConversationId);
    });
};
