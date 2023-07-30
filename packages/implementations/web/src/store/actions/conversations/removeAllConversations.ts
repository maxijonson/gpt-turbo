import { createAction } from "../createAction";
import { setActiveConversation } from "./setActiveConversation";

export const removeAllConversations = createAction(({ set }) => {
    set((state) => {
        state.conversations = [];
        state.conversationLastEdits = new Map();
        state.conversationNames = new Map();
        setActiveConversation(null);
    });
}, "removeAllConversations");
