import React from "react";
import { useAppStore } from "../..";

export const useGetConversationLastEdit = () => {
    const conversationLastEdits = useAppStore(
        (state) => state.conversationLastEdits
    );

    return React.useCallback(
        (id: string) => conversationLastEdits.get(id),
        [conversationLastEdits]
    );
};
