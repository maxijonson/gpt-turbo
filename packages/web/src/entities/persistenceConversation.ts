import { z } from "zod";
import { conversationSchema } from "gpt-turbo";

export const persistenceConversationSchema = conversationSchema.extend({
    name: z.string(),
});

export type PersistenceConversation = z.infer<
    typeof persistenceConversationSchema
>;
