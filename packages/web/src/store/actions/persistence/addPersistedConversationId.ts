import { useAppStore } from "../..";

export const addPersistedConversationId = (id: string) => {
    useAppStore.setState((state) => {
        state.persistedConversationIds.push(id);
    });
};
