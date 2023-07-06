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
import useCallableFunctions from "../../hooks/useCallableFunctions";
import { PersistenceCallableFunction } from "../../entities/persistenceCallableFunction";
import { STORAGEKEY_PERSISTENCE } from "../../config/constants";

interface PersistenceProviderProps {
    children?: React.ReactNode;
}

const PersistenceProvider = ({ children }: PersistenceProviderProps) => {
    const {
        conversations,
        addConversation,
        setActiveConversation,
        getConversationName,
        setConversationName,
        getConversationLastEdit,
        setConversationLastEdit,
    } = useConversationManager();

    const {
        callableFunctions,
        showFunctionsWarning,
        showFunctionsImportWarning,
        addCallableFunction,
        getCallableFunctionDisplayName,
        getCallableFunctionCode,
        dismissFunctionsWarning,
        dismissFunctionsImportWarning,
    } = useCallableFunctions();

    const { value: persistence, setValue: setPersistence } =
        useStorage<Persistence>(
            STORAGEKEY_PERSISTENCE,
            {
                version: 0,
                conversations: [],
                contexts: [],
                prompts: [],
                functionsWarning: true,
                functionsImportWarning: true,
                functions: [],
            },
            persistenceSchema
        );

    const [persistedConversationIds, setPersistedConversationIds] =
        React.useState<string[]>([]);
    const [hasInit, setHasInit] = React.useState(false);

    const addPersistedConversationId = React.useCallback<
        PersistenceContextValue["addPersistedConversationId"]
    >((id) => {
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
                lastEdited: getConversationLastEdit(conversation.id),
            }))
            .filter(
                (conversation, index, self) =>
                    self.findIndex((c) => c.id === conversation.id) === index
            );

        setPersistence((current) => ({
            ...current,
            conversations: persistedConversations,
        }));
    }, [
        conversations,
        getConversationLastEdit,
        getConversationName,
        persistedConversationIds,
        setPersistence,
    ]);

    const saveContext = React.useCallback<
        PersistenceContextValue["saveContext"]
    >(
        (context) => {
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

    const savePrompt = React.useCallback<PersistenceContextValue["savePrompt"]>(
        (prompt) => {
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

    const saveCallableFunctions = React.useCallback(() => {
        const persistedCallableFunctions: PersistenceCallableFunction[] =
            callableFunctions
                .map((fn) => ({
                    ...fn.toJSON(),
                    displayName: getCallableFunctionDisplayName(fn.id),
                    code: getCallableFunctionCode(fn.id),
                }))
                .filter(
                    (fn, index, self) =>
                        self.findIndex((c) => c.id === fn.id) === index
                );

        setPersistence((current) => ({
            ...current,
            functions: persistedCallableFunctions,
        }));
    }, [
        callableFunctions,
        getCallableFunctionCode,
        getCallableFunctionDisplayName,
        setPersistence,
    ]);

    const saveFunctionsWarning = React.useCallback(() => {
        setPersistence((current) => ({
            ...current,
            functionsWarning: showFunctionsWarning,
        }));
    }, [setPersistence, showFunctionsWarning]);

    const saveFunctionsImportWarning = React.useCallback(() => {
        setPersistence((current) => ({
            ...current,
            functionsImportWarning: showFunctionsImportWarning,
        }));
    }, [setPersistence, showFunctionsImportWarning]);

    const removeContext = React.useCallback<
        PersistenceContextValue["removeContext"]
    >(
        (contextName) => {
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

    const removePrompt = React.useCallback<
        PersistenceContextValue["removePrompt"]
    >(
        (promptName) => {
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
            hasInit,
            saveContext,
            savePrompt,
            removeContext,
            removePrompt,
        }),
        [
            persistence,
            addPersistedConversationId,
            persistedConversationIds,
            hasInit,
            saveContext,
            savePrompt,
            removeContext,
            removePrompt,
        ]
    );

    // Load persisted conversations/functions
    const isAlreadyLoading = React.useRef(false);
    React.useEffect(() => {
        if (hasInit || isAlreadyLoading.current) return;
        isAlreadyLoading.current = true;

        const loadConversations = async () => {
            for (let i = 0; i < persistence.conversations.length; i++) {
                const { name, lastEdited, ...conversationJson } =
                    persistence.conversations[i];
                const newConversation = addConversation(
                    await Conversation.fromJSON(conversationJson)
                );
                if (i === 0) setActiveConversation(newConversation.id, true);
                addPersistedConversationId(newConversation.id);
                setConversationName(newConversation.id, name);
                setConversationLastEdit(newConversation.id, lastEdited);
            }
        };

        const loadCallableFunctions = () => {
            for (const {
                displayName,
                code,
                ...callableFunctionJson
            } of persistence.functions) {
                addCallableFunction(callableFunctionJson, displayName, code);
            }

            if (!persistence.functionsWarning) {
                dismissFunctionsWarning();
            }

            if (!persistence.functionsImportWarning) {
                dismissFunctionsImportWarning();
            }
        };

        const load = async () => {
            try {
                await Promise.all([
                    loadConversations(),
                    loadCallableFunctions(),
                ]);
            } catch (e) {
                console.error(e);
            }
            setHasInit(true);
        };
        load();
    }, [
        addCallableFunction,
        addConversation,
        addPersistedConversationId,
        dismissFunctionsImportWarning,
        dismissFunctionsWarning,
        hasInit,
        persistence.conversations,
        persistence.functions,
        persistence.functionsImportWarning,
        persistence.functionsWarning,
        setActiveConversation,
        setConversationLastEdit,
        setConversationName,
    ]);

    // Save conversations on change
    React.useEffect(() => {
        if (!hasInit) return;

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
    }, [conversations, hasInit, persistedConversationIds, saveConversations]);

    // Save callable functions on change
    React.useEffect(() => {
        if (!hasInit) return;
        saveCallableFunctions();
    }, [hasInit, saveCallableFunctions]);

    // Save show functions warning on change
    React.useEffect(() => {
        if (!hasInit) return;
        saveFunctionsWarning();
    }, [hasInit, saveFunctionsWarning]);

    // Save show functions import warning on change
    React.useEffect(() => {
        if (!hasInit) return;
        saveFunctionsImportWarning();
    }, [hasInit, saveFunctionsImportWarning]);

    return (
        <PersistenceContextComponent.Provider value={providerValue}>
            {children}
        </PersistenceContextComponent.Provider>
    );
};

export default PersistenceProvider;
