import { Conversation } from "gpt-turbo";
import React from "react";
import makeNotImplemented from "../utils/makeNotImplemented.js";

export interface ConversationManagerContextValue {
    conversation: Conversation | null;
    setConversation: React.Dispatch<React.SetStateAction<Conversation | null>>;
}

const notImplemented = makeNotImplemented("ConversationManagerContext");
export const ConversationManagerContext =
    React.createContext<ConversationManagerContextValue>({
        conversation: null,
        setConversation: notImplemented,
    });
