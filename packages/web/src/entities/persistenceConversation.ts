import { z } from "zod";
import { conversationSchema } from "gpt-turbo";

export const persistenceConversationSchema = conversationSchema.extend({
    config: conversationSchema.shape.config
        .unwrap()
        .omit({ apiKey: true })
        .optional(),

    name: z.string(),
    lastEdited: z.number(),
});

export type PersistenceConversation = z.infer<
    typeof persistenceConversationSchema
>;
