import { useAppStore } from "../..";

export const setConversationName = (id: string, name: string) => {
    useAppStore.setState((state) => {
        state.conversationNames.set(id, name);
    });
};
