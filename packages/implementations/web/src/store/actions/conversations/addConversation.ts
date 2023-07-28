import { Conversation, ConversationOptions } from "gpt-turbo";
import { createAction } from "../createAction";
import { addPersistedConversationId } from "../persistence/addPersistedConversationId";

export const addConversation = createAction(
    (
        { set, get },
        conversation: Conversation | ConversationOptions,
        functionIds: string[] = [],
        save = false
    ) => {
        const { callableFunctions } = get();
        const newConversation =
            conversation instanceof Conversation
                ? conversation
                : new Conversation(conversation);

        for (const functionId of functionIds) {
            const callableFunction = callableFunctions.find(
                (callableFunction) => callableFunction.id === functionId
            );
            if (callableFunction) {
                newConversation.callableFunctions.addFunction(callableFunction);
            }
        }

        set((state) => {
            state.conversations = state.conversations
                .filter(
                    (conversation) => conversation.id !== newConversation.id
                )
                .concat(newConversation);
            state.conversationLastEdits.set(newConversation.id, Date.now());
        });

        if (save) {
            addPersistedConversationId(newConversation.id);
        }

        return newConversation;
    },
    "addConversation"
);
