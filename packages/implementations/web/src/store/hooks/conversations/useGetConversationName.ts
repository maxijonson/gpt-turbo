import React from "react";
import { useAppStore } from "../..";

export const useGetConversationName = () => {
    const conversationNames = useAppStore((state) => state.conversationNames);

    return React.useCallback(
        (id: string) => conversationNames.get(id),
        [conversationNames]
    );
};
