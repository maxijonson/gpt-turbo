import React from "react";
import { Conversation, ConversationConfigParameters } from "gpt-turbo";
import {
    ConversationManagerContext,
    ConversationManagerContextValue,
} from "../ConversationManagerContext";

interface ConversationManagerProviderProps {
    children?: React.ReactNode;
}

export default ({ children }: ConversationManagerProviderProps) => {
    const [conversations, setConversations] = React.useState<Conversation[]>(
        []
    );
    const [activeId, setActiveId] = React.useState<string | null>(null);

    const addConversation = React.useCallback(
        (conversation: ConversationConfigParameters) => {
            const newConversation = new Conversation(conversation);
            setConversations((c) => [...c, newConversation]);
            return newConversation;
        },
        []
    );

    const setActiveConversation = React.useCallback(
        (id: string | null, force = false) => {
            if (force) {
                return setActiveId(id);
            }
            if (!id) {
                return setActiveId(null);
            }

            const conversation = conversations.find((c) => c.id === id);

            if (!conversation) {
                return setActiveId(null);
            }

            setActiveId(id);
        },
        [conversations]
    );

    const removeConversation = React.useCallback(
        (id: string) => {
            setConversations((c) => {
                return c.filter((conversation) => conversation.id !== id);
            });
            setActiveConversation(activeId);
        },
        [activeId, setActiveConversation]
    );

    const providerValue = React.useMemo<ConversationManagerContextValue>(
        () => ({
            conversations: Array.from(conversations.values()),
            activeId,
            activeConversation:
                conversations.find((c) => c.id === activeId) ?? null,
            addConversation,
            removeConversation,
            setActiveConversation,
        }),
        [
            activeId,
            addConversation,
            conversations,
            removeConversation,
            setActiveConversation,
        ]
    );

    return (
        <ConversationManagerContext.Provider value={providerValue}>
            {children}
        </ConversationManagerContext.Provider>
    );
};
