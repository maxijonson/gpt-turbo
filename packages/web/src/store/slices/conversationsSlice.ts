import { Conversation } from "gpt-turbo";
import { AppStateSlice } from "..";

export interface ConversationsState {
    conversations: Conversation[];
    activeConversationId: string | null;
    conversationNames: Map<string, string>;
    conversationLastEdits: Map<string, number>;
}

export const initialConversationsState: ConversationsState = {
    conversations: [],
    activeConversationId: null,
    conversationNames: new Map(),
    conversationLastEdits: new Map(),
};

export const createConversationsSlice: AppStateSlice<ConversationsState> = () =>
    initialConversationsState;
