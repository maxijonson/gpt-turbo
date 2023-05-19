import React from "react";
import {
    PersistenceContext as PersistenceContextComponent,
    PersistenceContextValue,
} from "../PersistenceContext";
import useStorage from "../../hooks/useStorage";
import useConversationManager from "../../hooks/useConversationManager";
import { Persistence, persistenceSchema } from "../../entities/persistence";
import { PersistenceConversation } from "../../entities/persistenceConversation";
import { Conversation, Message } from "gpt-turbo";
import { PersistenceContext } from "../../entities/persistenceContext";
import { PersistencePrompt } from "../../entities/persistencePrompt";

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
            contexts: [],
            prompts: [],
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

    const saveConversations = React.useCallback(() => {
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

        setPersistence((current) => ({
            ...current,
            conversations: persistedConversations,
        }));
    }, [
        conversations,
        getConversationName,
        persistedConversationIds,
        setPersistence,
    ]);

    const saveContext = React.useCallback(
        (context: PersistenceContext) => {
            setPersistence((current) => {
                if (current.contexts.includes(context)) {
                    return current;
                }
                return persistenceSchema.parse({
                    ...current,
                    contexts: [...current.contexts, context],
                });
            });
        },
        [setPersistence]
    );

    const savePrompt = React.useCallback(
        (prompt: PersistencePrompt) => {
            setPersistence((current) => {
                if (current.prompts.includes(prompt)) {
                    return current;
                }
                return persistenceSchema.parse({
                    ...current,
                    prompts: [...current.prompts, prompt],
                });
            });
        },
        [setPersistence]
    );

    const removeContext = React.useCallback(
        (contextName: string) => {
            setPersistence((current) =>
                persistenceSchema.parse({
                    ...current,
                    contexts: current.contexts.filter(
                        (c) => c.name !== contextName
                    ),
                })
            );
        },
        [setPersistence]
    );

    const removePrompt = React.useCallback(
        (promptName: string) => {
            setPersistence((current) =>
                persistenceSchema.parse({
                    ...current,
                    prompts: current.prompts.filter(
                        (p) => p.name !== promptName
                    ),
                })
            );
        },
        [setPersistence]
    );

    const providerValue = React.useMemo<PersistenceContextValue>(
        () => ({
            persistence,
            addPersistedConversationId,
            persistedConversationIds,
            isLoading,
            hasInit,
            saveContext,
            savePrompt,
            removeContext,
            removePrompt,
        }),
        [
            addPersistedConversationId,
            hasInit,
            isLoading,
            persistedConversationIds,
            persistence,
            removeContext,
            removePrompt,
            saveContext,
            savePrompt,
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

        saveConversations();

        const offs = conversations
            .filter((conversation) =>
                persistedConversationIds.includes(conversation.id)
            )
            .map((conversation) => {
                const messageOffs: (() => void)[] = [];

                const attachMessageListeners = () => (message: Message) => {
                    messageOffs.push(
                        message.onMessageStreamingStop(() => {
                            saveConversations();
                        })
                    );

                    messageOffs.push(
                        message.onMessageUpdate((_, m) => {
                            if (m.isStreaming) return;
                            saveConversations();
                        })
                    );
                };

                conversation.getMessages().forEach(attachMessageListeners());

                const offMessageAdded = conversation.onMessageAdded(
                    (message) => {
                        saveConversations();
                        attachMessageListeners()(message);
                    }
                );

                const offMessageRemoved = conversation.onMessageRemoved(() => {
                    saveConversations();
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
    }, [
        conversations,
        hasInit,
        isLoading,
        persistedConversationIds,
        saveConversations,
    ]);

    return (
        <PersistenceContextComponent.Provider value={providerValue}>
            {children}
        </PersistenceContextComponent.Provider>
    );
};
