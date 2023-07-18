import { Conversation } from "gpt-turbo";
import { ConversationExport } from "../../../entities/conversationExport";
import { createAction } from "../createAction";
import { addConversation } from "./addConversation";
import { setConversationName } from "./setConversationName";
import { addPersistedConversationId } from "../persistence/addPersistedConversationId";

export const importConversations = createAction(
    async ({ get }, conversationExports: ConversationExport[]) => {
        const { defaultSettings: settings } = get();
        const imported: Conversation[] = [];

        for (const { conversation: json, name } of conversationExports) {
            const conversation = await Conversation.fromJSON({
                ...json,
                config: {
                    ...json.config,
                    apiKey: settings.apiKey || undefined,
                },
            });
            addConversation(conversation);
            setConversationName(conversation.id, name);
            addPersistedConversationId(conversation.id);
            imported.push(conversation);
        }

        return imported;
    },
    "importConversations"
);
