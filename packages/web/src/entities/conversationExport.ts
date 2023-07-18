import { conversationSchema } from "gpt-turbo";
import { z } from "zod";

export const conversationExportSchema = z.object({
    conversation: conversationSchema
        .extend({
            config: conversationSchema.shape.config
                .unwrap()
                .omit({ apiKey: true })
                .optional(),
        })
        .omit({
            id: true,
        }),
    name: z.string().nonempty("Conversation name cannot be empty"),
});

export type ConversationExport = z.infer<typeof conversationExportSchema>;
