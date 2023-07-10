import { useAppStore } from "../..";

export const setConversationLastEdit = (id: string, lastEdit = Date.now()) => {
    useAppStore.setState((state) => {
        state.conversationLastEdits.set(id, lastEdit);
    });
};
