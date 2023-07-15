import {
    Conversation,
    ConversationConfigParameters,
    RequestOptions,
} from "gpt-turbo";
import { createAction } from "../createAction";

export const addConversation = createAction(
    (
        { set },
        conversation: Conversation | ConversationConfigParameters,
        requestOptions?: RequestOptions
    ) => {
        const newConversation =
            conversation instanceof Conversation
                ? conversation
                : new Conversation(conversation, requestOptions);

        set((state) => {
            state.conversations.push(newConversation);
            state.conversationLastEdits.set(newConversation.id, Date.now());
        });

        return newConversation;
    },
    "addConversation"
);
