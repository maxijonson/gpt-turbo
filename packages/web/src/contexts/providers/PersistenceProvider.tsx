import React from "react";
import {
    PersistenceContext,
    PersistenceContextValue,
} from "../PersistenceContext";
import useStorage from "../../hooks/useStorage";
import useConversationManager from "../../hooks/useConversationManager";
import { Persistence, persistenceSchema } from "../../entities/persistence";
import { PersistenceConversation } from "../../entities/persistenceConversation";
import { Conversation, Message } from "gpt-turbo";

interface PersistenceProviderProps {
    children?: React.ReactNode;
}

export default ({ children }: PersistenceProviderProps) => {
    const {
        conversations,
        addConversation,
        setActiveConversation,
        getConversationName,
        setConversationName,
    } = useConversationManager();
    const {
        value: persistence,
        setValue: setPersistence,
        isValueLoaded: isPersistenceLoaded,
    } = useStorage<Persistence>(
        "gpt-turbo-persistence",
        {
            conversations: [],
        },
        persistenceSchema
    );
    const [persistedConversationIds, setPersistedConversationIds] =
        React.useState<string[]>([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const [hasInit, setHasInit] = React.useState(false);

    const addPersistedConversationId = React.useCallback((id: string) => {
        setPersistedConversationIds((current) => {
            if (current.includes(id)) {
                return current;
            }

            return [...current, id];
        });
    }, []);

    const save = React.useCallback(() => {
        const persistedConversations: PersistenceConversation[] = conversations
            .filter(
                (conversation) =>
                    persistedConversationIds.includes(conversation.id) &&
                    conversation.getMessages().length
            )
            .map((conversation) => ({
                ...conversation.toJSON(),
                name: getConversationName(conversation.id),
            }));

        setPersistence({
            conversations: persistedConversations,
        });
    }, [
        conversations,
        getConversationName,
        persistedConversationIds,
        setPersistence,
    ]);

    const providerValue = React.useMemo<PersistenceContextValue>(
        () => ({
            persistence,
            addPersistedConversationId,
            persistedConversationIds,
            isLoading,
            hasInit,
        }),
        [
            addPersistedConversationId,
            hasInit,
            isLoading,
            persistedConversationIds,
            persistence,
        ]
    );

    // Load persisted conversations
    React.useEffect(() => {
        if (!isPersistenceLoaded || isLoading || hasInit) return;
        if (!persistence.conversations.length) return setHasInit(true);

        setIsLoading(true);
        const load = async () => {
            let i = -1;
            for (const {
                name,
                ...conversationJson
            } of persistence.conversations) {
                const newConversation = addConversation(
                    await Conversation.fromJSON(conversationJson)
                );
                if (++i === 0) setActiveConversation(newConversation.id, true);
                addPersistedConversationId(newConversation.id);
                setConversationName(newConversation.id, name);
            }
        };
        load().then(() => {
            setIsLoading(false);
            setHasInit(true);
        });
    }, [
        addConversation,
        addPersistedConversationId,
        hasInit,
        isLoading,
        isPersistenceLoaded,
        persistence,
        setActiveConversation,
        setConversationName,
    ]);

    // Save conversations on change
    React.useEffect(() => {
        if (isLoading || !hasInit) return;

        save();

        const offs = conversations
            .filter((conversation) =>
                persistedConversationIds.includes(conversation.id)
            )
            .map((conversation) => {
                const messageOffs: (() => void)[] = [];

                const attachMessageListeners = () => (message: Message) => {
                    messageOffs.push(
                        message.onMessageStreamingStop(() => {
                            save();
                        })
                    );

                    messageOffs.push(
                        message.onMessageUpdate((_, m) => {
                            if (m.isStreaming) return;
                            save();
                        })
                    );
                };

                conversation.getMessages().forEach(attachMessageListeners());

                const offMessageAdded = conversation.onMessageAdded(
                    (message) => {
                        save();
                        attachMessageListeners()(message);
                    }
                );

                const offMessageRemoved = conversation.onMessageRemoved(() => {
                    save();
                });

                return () => {
                    offMessageAdded();
                    offMessageRemoved();
                    messageOffs.forEach((off) => off());
                };
            });

        return () => {
            offs.forEach((off) => off());
        };
    }, [conversations, hasInit, isLoading, persistedConversationIds, save]);

    return (
        <PersistenceContext.Provider value={providerValue}>
            {children}
        </PersistenceContext.Provider>
    );
};
