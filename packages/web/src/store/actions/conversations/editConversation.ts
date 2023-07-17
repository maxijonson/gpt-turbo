import { ConversationFormValues } from "../../../contexts/ConversationFormContext";
import { createAction } from "../createAction";
import { addPersistedConversationId } from "../persistence/addPersistedConversationId";
import { removePersistedConversationId } from "../persistence/removePersistedConversationId";

export const editConversation = createAction(
    (
        { get },
        id: string,
        {
            save,
            functionIds,

            headers,
            proxy,

            ...config
        }: Partial<ConversationFormValues>
    ) => {
        const { conversations, callableFunctions } = get();
        const conversation = conversations.find(
            (conversation) => conversation.id === id
        );

        if (!conversation) {
            throw new Error(`Conversation with id ${id} not found`);
        }

        conversation.setConfig(config, true);
        conversation.setRequestOptions({
            headers,
            proxy,
        });

        if (functionIds) {
            conversation.clearFunctions();
            for (const functionId of functionIds) {
                const callableFunction = callableFunctions.find(
                    (callableFunction) => callableFunction.id === functionId
                );
                if (callableFunction) {
                    conversation.addFunction(callableFunction);
                }
            }
        }

        // semi-HACK: This will ensure a re-render and persist. Both of these have no effect if they're already in the state we're setting them to.
        if (save) {
            addPersistedConversationId(id);
        } else {
            removePersistedConversationId(id);
        }

        return conversation;
    },
    "editConversation"
);
