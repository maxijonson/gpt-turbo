import { Conversation, ConversationConfigParameters } from "gpt-turbo";
import React from "react";
import makeNotImplemented from "../utils/makeNotImplemented";

export interface ConversationManagerContextValue {
    conversations: Conversation[];
    activeId: string | null;
    activeConversation: Conversation | null;
    addConversation: (
        conversationConfig: ConversationConfigParameters
    ) => Conversation;
    removeConversation: (id: string) => void;
    setActiveConversation: (id: string | null, force?: boolean) => void;
}

const notImplemented = makeNotImplemented("ConversationManagerContext");
export const ConversationManagerContext =
    React.createContext<ConversationManagerContextValue>({
        conversations: [],
        activeId: null,
        activeConversation: null,
        addConversation: notImplemented,
        removeConversation: notImplemented,
        setActiveConversation: notImplemented,
    });
