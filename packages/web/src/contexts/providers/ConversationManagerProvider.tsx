import React from "react";
import {
    Conversation,
    ConversationConfigParameters,
    RequestOptions,
} from "gpt-turbo";
import {
    ConversationManagerContext,
    ConversationManagerContextValue,
} from "../ConversationManagerContext";
import useStorage from "../../hooks/useStorage";
import { z } from "zod";
import { STORAGEKEY_SHOWUSAGE } from "../../config/constants";

interface ConversationManagerProviderProps {
    children?: React.ReactNode;
}

const ConversationManagerProvider = ({
    children,
}: ConversationManagerProviderProps) => {
    const [conversations, setConversations] = React.useState<Conversation[]>(
        []
    );
    const [activeId, setActiveId] = React.useState<string | null>(null);

    const [conversationNames, setConversationNames] = React.useState<
        Map<string, string>
    >(new Map());
    const [conversationLastEdits, setconversationLastEdits] = React.useState<
        Map<string, number>
    >(new Map());

    const { value: showUsage, setValue: setShowUsage } = useStorage(
        STORAGEKEY_SHOWUSAGE,
        true,
        z.boolean()
    );

    const activeConversation = React.useMemo(
        () => conversations.find((c) => c.id === activeId) ?? null,
        [activeId, conversations]
    );

    const addConversation = React.useCallback(
        (
            conversation: ConversationConfigParameters | Conversation,
            requestOptions?: RequestOptions
        ) => {
            const newConversation =
                conversation instanceof Conversation
                    ? conversation
                    : new Conversation(conversation, requestOptions);
            setConversations((c) => [...c, newConversation]);
            setconversationLastEdits((c) => {
                const newMap = new Map(c);
                newMap.set(newConversation.id, Date.now());
                return newMap;
            });
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

    const getConversationLastEdit = React.useCallback(
        (id: string) => {
            return conversationLastEdits.get(id) ?? Date.now();
        },
        [conversationLastEdits]
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

    const setConversationLastEdit = React.useCallback(
        (id: string, lastEdit = Date.now()) => {
            setconversationLastEdits((c) => {
                const newMap = new Map(c);
                newMap.set(id, lastEdit);
                return newMap;
            });
        },
        []
    );

    const providerValue = React.useMemo<ConversationManagerContextValue>(
        () => ({
            conversations: Array.from(conversations.values()),
            activeId,
            activeConversation,
            showUsage,
            addConversation,
            removeConversation,
            removeAllConversations,
            setActiveConversation,
            getConversationName,
            setConversationName,
            getConversationLastEdit,
            setConversationLastEdit,
            setShowUsage,
        }),
        [
            activeConversation,
            activeId,
            addConversation,
            conversations,
            getConversationLastEdit,
            getConversationName,
            removeAllConversations,
            removeConversation,
            setActiveConversation,
            setConversationLastEdit,
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

export default ConversationManagerProvider;
