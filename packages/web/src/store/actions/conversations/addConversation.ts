import {
    Conversation,
    ConversationConfigParameters,
    RequestOptions,
} from "gpt-turbo";
import { useAppStore } from "../..";

export const addConversation = (
    conversation: Conversation | ConversationConfigParameters,
    requestOptions?: RequestOptions
) => {
    const newConversation =
        conversation instanceof Conversation
            ? conversation
            : new Conversation(conversation, requestOptions);

    useAppStore.setState((state) => {
        state.conversations.push(newConversation);
        state.conversationLastEdits.set(newConversation.id, Date.now());
    });

    return newConversation;
};
