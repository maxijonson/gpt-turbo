import { useAppStore } from "../..";
import { setActiveConversation } from "./setActiveConversation";

export const removeAllConversations = () => {
    useAppStore.setState((state) => {
        state.conversations = [];
        state.conversationLastEdits = new Map();
        state.conversationNames = new Map();
        setActiveConversation(null);
    });
};
