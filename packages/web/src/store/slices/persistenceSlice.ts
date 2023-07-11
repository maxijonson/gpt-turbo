import { AppStateSlice } from "..";

export interface PersistenceState {
    persistedConversationIds: string[];
}

export const initialPersistenceState: PersistenceState = {
    persistedConversationIds: [],
};

export const createPersistenceSlice: AppStateSlice<PersistenceState> = () =>
    initialPersistenceState;
