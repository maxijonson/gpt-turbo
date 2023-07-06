import React from "react";
import makeNotImplemented from "../utils/makeNotImplemented";
import { Persistence } from "../entities/persistence";
import { PersistenceContext as PersistenceContextEntity } from "../entities/persistenceContext";
import { PersistencePrompt } from "../entities/persistencePrompt";

export interface PersistenceContextValue {
    persistence: Persistence;
    addPersistedConversationId: (id: string) => void;
    persistedConversationIds: string[];
    hasInit: boolean;
    saveContext: (context: PersistenceContextEntity) => void;
    savePrompt: (prompt: PersistencePrompt) => void;
    removeContext: (contextName: string) => void;
    removePrompt: (promptName: string) => void;
}

const notImplemented = makeNotImplemented("PersistenceContext");
export const PersistenceContext = React.createContext<PersistenceContextValue>({
    persistence: {
        version: 0,
        conversations: [],
        contexts: [],
        prompts: [],
        functionsWarning: true,
        functionsImportWarning: true,
        functions: [],
    },
    addPersistedConversationId: notImplemented,
    persistedConversationIds: [],
    hasInit: true,
    saveContext: notImplemented,
    savePrompt: notImplemented,
    removeContext: notImplemented,
    removePrompt: notImplemented,
});
