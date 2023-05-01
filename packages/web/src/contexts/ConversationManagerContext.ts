import { Conversation, ConversationConfigParameters } from "gpt-turbo";
import React from "react";
import makeNotImplemented from "../utils/makeNotImplemented";

export interface ConversationManagerContextValue {
    conversations: Conversation[];
    activeId: string | null;
    activeConversation: Conversation | null;
    showUsage: boolean;
    addConversation: (
        conversationConfig: ConversationConfigParameters | Conversation
    ) => Conversation;
    removeConversation: (id: string) => void;
    removeAllConversations: () => void;
    setActiveConversation: (id: string | null, force?: boolean) => void;
    getConversationName: (id: string) => string;
    setConversationName: (id: string, name: string) => void;
    setShowUsage: React.Dispatch<React.SetStateAction<boolean>>;
}

const notImplemented = makeNotImplemented("ConversationManagerContext");
export const ConversationManagerContext =
    React.createContext<ConversationManagerContextValue>({
        conversations: [],
        activeId: null,
        activeConversation: null,
        showUsage: false,
        addConversation: notImplemented,
        removeConversation: notImplemented,
        removeAllConversations: notImplemented,
        setActiveConversation: notImplemented,
        getConversationName: notImplemented,
        setConversationName: notImplemented,
        setShowUsage: notImplemented,
    });
