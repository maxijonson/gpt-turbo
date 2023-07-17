import { Conversation } from "gpt-turbo";
import { createAction } from "../createAction";
import { addConversation } from "./addConversation";
import { setConversationName } from "./setConversationName";

export const duplicateConversation = createAction(
    async ({ get }, id: string) => {
        const { conversations, persistedConversationIds, conversationNames } =
            get();
        const conversation = conversations.find((c) => c.id === id);

        if (!conversation) {
            throw new Error(`Conversation with id ${id} not found`);
        }

        const { id: _, ...json } = conversation.toJSON();
        const copy = await Conversation.fromJSON(json);

        const newConversation = addConversation(
            copy,
            undefined,
            undefined,
            persistedConversationIds.includes(id)
        );

        const name = conversationNames.get(id);
        if (name) {
            setConversationName(newConversation.id, name);
        }
    },
    "duplicateConversation"
);
