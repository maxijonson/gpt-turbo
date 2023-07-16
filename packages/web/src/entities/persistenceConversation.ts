import { z } from "zod";
import { conversationSchema } from "gpt-turbo";

export const persistenceConversationSchema = conversationSchema.extend({
    config: conversationSchema.shape.config
        .unwrap()
        .omit({ apiKey: true })
        .optional(),

    name: z.string().nonempty("Conversation name cannot be empty"),
    lastEdited: z.number(),
});

export type PersistenceConversation = z.infer<
    typeof persistenceConversationSchema
>;
