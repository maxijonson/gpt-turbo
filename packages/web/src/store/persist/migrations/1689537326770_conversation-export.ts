import { produce } from "immer";
import { StoreMigration } from ".";

export const migrationConversationExport: StoreMigration = produce(
    (persistedState) => {
        for (const conversation of persistedState.conversations) {
            conversation.name = conversation.name || "New Chat";
        }
    }
);
