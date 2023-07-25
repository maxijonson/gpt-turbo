import React from "react";
import { shallow } from "zustand/shallow";
import { useAppStore } from "../..";

export const useActiveConversation = () => {
    const [conversations, activeConversationId] = useAppStore(
        (state) => [state.conversations, state.activeConversationId],
        shallow
    );

    return React.useMemo(() => {
        return conversations.find(
            (conversation) => conversation.id === activeConversationId
        );
    }, [activeConversationId, conversations]);
};
