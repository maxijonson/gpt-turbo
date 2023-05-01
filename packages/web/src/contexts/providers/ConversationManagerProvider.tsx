import React from "react";
import { Conversation, ConversationConfigParameters } from "gpt-turbo";
import {
    ConversationManagerContext,
    ConversationManagerContextValue,
} from "../ConversationManagerContext";
import useStorage from "../../hooks/useStorage";
import { z } from "zod";

interface ConversationManagerProviderProps {
    children?: React.ReactNode;
}

export default ({ children }: ConversationManagerProviderProps) => {
    const [conversations, setConversations] = React.useState<Conversation[]>(
        []
    );
    const [activeId, setActiveId] = React.useState<string | null>(null);
    const [conversationNames, setConversationNames] = React.useState<
        Map<string, string>
    >(new Map());
    const { value: showUsage, setValue: setShowUsage } = useStorage(
        "gpt-turbo-showusage",
        true,
        z.boolean()
    );

    const addConversation = React.useCallback(
        (conversation: ConversationConfigParameters | Conversation) => {
            const newConversation =
                conversation instanceof Conversation
                    ? conversation
                    : new Conversation(conversation);
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

    const removeAllConversations = React.useCallback(() => {
        setConversations([]);
        setActiveConversation(null);
    }, [setActiveConversation]);

    const getConversationName = React.useCallback(
        (id: string) => {
            return conversationNames.get(id) ?? "New Chat";
        },
        [conversationNames]
    );

    const setConversationName = React.useCallback(
        (id: string, name: string) => {
            setConversationNames((c) => {
                const newMap = new Map(c);
                newMap.set(id, name);
                return newMap;
            });
        },
        []
    );

    const providerValue = React.useMemo<ConversationManagerContextValue>(
        () => ({
            conversations: Array.from(conversations.values()),
            activeId,
            activeConversation:
                conversations.find((c) => c.id === activeId) ?? null,
            showUsage,
            addConversation,
            removeConversation,
            removeAllConversations,
            setActiveConversation,
            getConversationName,
            setConversationName,
            setShowUsage,
        }),
        [
            activeId,
            addConversation,
            conversations,
            getConversationName,
            removeAllConversations,
            removeConversation,
            setActiveConversation,
            setConversationName,
            setShowUsage,
            showUsage,
        ]
    );

    return (
        <ConversationManagerContext.Provider value={providerValue}>
            {children}
        </ConversationManagerContext.Provider>
    );
};
