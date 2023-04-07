import { Conversation } from "gpt-turbo";
import React from "react";
import {
    ConversationManagerContext,
    ConversationManagerContextValue,
} from "../ConversationManagerContext.js";

interface ConversationManagerProviderProps {
    children?: React.ReactNode;
}

export default ({ children }: ConversationManagerProviderProps) => {
    const [conversation, setConversation] = React.useState<Conversation | null>(
        null
    );

    const providerValue = React.useMemo<ConversationManagerContextValue>(
        () => ({
            conversation,
            setConversation,
        }),
        [conversation]
    );

    return (
        <ConversationManagerContext.Provider value={providerValue}>
            {children}
        </ConversationManagerContext.Provider>
    );
};
