import React from "react";
import {
    ConversationManagerContext,
    ConversationManagerContextValue,
} from "../ConversationManagerContext";
import { useAppStore } from "../../store";
import { persistStore } from "../../store/persist/triggerPersist";

interface ConversationManagerProviderProps {
    children?: React.ReactNode;
}

const ConversationManagerProvider = ({
    children,
}: ConversationManagerProviderProps) => {
    const [conversations, names, lastEdits, activeId] = useAppStore((state) => [
        state.conversations,
        state.conversationNames,
        state.conversationLastEdits,
        state.activeConversationId,
    ]);

    const activeConversation = React.useMemo(
        () => conversations.find((c) => c.id === activeId) ?? null,
        [activeId, conversations]
    );

    const getConversationName = React.useCallback(
        (id: string) => {
            return names.get(id) ?? "New Chat";
        },
        [names]
    );

    const getConversationLastEdit = React.useCallback(
        (id: string) => {
            return lastEdits.get(id) ?? Date.now();
        },
        [lastEdits]
    );

    const providerValue = React.useMemo<ConversationManagerContextValue>(
        () => ({
            activeId,
            activeConversation,
            getConversationName,
            getConversationLastEdit,
        }),
        [
            activeConversation,
            activeId,
            getConversationLastEdit,
            getConversationName,
        ]
    );

    React.useEffect(() => {
        if (!activeConversation) return;
        const unsubs: (() => void)[] = [];

        unsubs.push(
            activeConversation.onMessageAdded((message) => {
                if (message.content) {
                    persistStore();
                }

                unsubs.push(
                    message.onMessageStreamingStop(() => {
                        persistStore();
                    })
                );
            }),
            activeConversation.onMessageRemoved(() => {
                persistStore();
            })
        );

        return () => {
            unsubs.forEach((u) => u());
        };
    }, [activeConversation]);

    return (
        <ConversationManagerContext.Provider value={providerValue}>
            {children}
        </ConversationManagerContext.Provider>
    );
};

export default ConversationManagerProvider;
