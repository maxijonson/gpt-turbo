import React from "react";
import makeNotImplemented from "../utils/makeNotImplemented";
import { Conversation } from "gpt-turbo";

export interface ConversationManagerContextValue {
    activeConversation: Conversation | null;
    getConversationName: (id: string) => string;
    getConversationLastEdit: (id: string) => number;
}

const notImplemented = makeNotImplemented("ConversationManagerContext");
export const ConversationManagerContext =
    React.createContext<ConversationManagerContextValue>({
        activeConversation: null,
        getConversationName: notImplemented,
        getConversationLastEdit: notImplemented,
    });
