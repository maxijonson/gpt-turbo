import { useAppStore } from "../..";

export const setActiveConversation = (id: string | null, force = false) => {
    if (force) {
        useAppStore.setState({ activeConversationId: id });
        return;
    }
    if (!id) {
        useAppStore.setState({ activeConversationId: null });
        return;
    }

    const { conversations } = useAppStore.getState();
    const conversation = conversations.find((c) => c.id === id);

    if (!conversation) {
        useAppStore.setState({ activeConversationId: null });
        return;
    }

    useAppStore.setState({ activeConversationId: id });
};
