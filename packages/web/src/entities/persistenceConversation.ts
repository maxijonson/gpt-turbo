import { z } from "zod";
import { conversationSchema } from "gpt-turbo";

export const persistenceConversationSchema = conversationSchema.extend({
    name: z.string(),
    lastEdited: z.number(),
    config: conversationSchema.shape.config
        .unwrap()
        .omit({ apiKey: true })
        .optional(),
});

export type PersistenceConversation = z.infer<
    typeof persistenceConversationSchema
>;
