import { Conversation } from "gpt-turbo";
import { AppStateSlice } from "..";

export interface ConversationsState {
    conversations: Conversation[];
    conversationNames: Map<string, string>;
    conversationLastEdits: Map<string, number>;
    activeConversationId: string | null;
}

export const initialConversationsState: ConversationsState = {
    conversations: [],
    conversationNames: new Map(),
    conversationLastEdits: new Map(),
    activeConversationId: null,
};

export const createConversationsSlice: AppStateSlice<ConversationsState> = () =>
    initialConversationsState;
