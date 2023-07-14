import React from "react";
import { useAppStore } from "../..";

export const useActiveConversation = () => {
    const [conversations, activeConversationId] = useAppStore((state) => [
        state.conversations,
        state.activeConversationId,
    ]);

    return React.useMemo(() => {
        return conversations.find(
            (conversation) => conversation.id === activeConversationId
        );
    }, [activeConversationId, conversations]);
};
