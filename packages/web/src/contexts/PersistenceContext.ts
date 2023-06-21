import React from "react";
import makeNotImplemented from "../utils/makeNotImplemented";
import { Persistence } from "../entities/persistence";
import { PersistenceContext as PersistenceContextEntity } from "../entities/persistenceContext";
import { PersistencePrompt } from "../entities/persistencePrompt";

export interface PersistenceContextValue {
    persistence: Persistence;
    addPersistedConversationId: (id: string) => void;
    persistedConversationIds: string[];
    isLoading: boolean;
    hasInit: boolean;
    saveContext: (context: PersistenceContextEntity) => void;
    savePrompt: (prompt: PersistencePrompt) => void;
    removeContext: (contextName: string) => void;
    removePrompt: (promptName: string) => void;
    dismissFunctionsWarning: () => void;
}

const notImplemented = makeNotImplemented("PersistenceContext");
export const PersistenceContext = React.createContext<PersistenceContextValue>({
    persistence: {
        conversations: [],
        contexts: [],
        prompts: [],
        functionsWarning: true,
    },
    addPersistedConversationId: notImplemented,
    persistedConversationIds: [],
    isLoading: false,
    hasInit: true,
    saveContext: notImplemented,
    savePrompt: notImplemented,
    removeContext: notImplemented,
    removePrompt: notImplemented,
    dismissFunctionsWarning: notImplemented,
});
