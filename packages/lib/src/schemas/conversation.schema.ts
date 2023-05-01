import { z } from "zod";
import { messageSchema } from "./message.schema.js";
import { conversationConfigSchema } from "./conversationConfig.schema.js";

/**
 * A JSON representation of a Conversation instance.
 */
export const conversationSchema = z.object({
    id: z.string().uuid().optional(),
    messages: z.array(messageSchema),
    config: conversationConfigSchema.optional(),
    requestOptions: z
        .object({
            headers: z.record(z.string(), z.string()).optional(),
            proxy: z
                .object({
                    host: z.string(),
                    port: z.number().optional(),
                    protocol: z.enum(["http", "https"]).optional(),
                    auth: z
                        .object({
                            username: z.string(),
                            password: z.string(),
                        })
                        .optional(),
                })
                .optional(),
        })
        .optional(),
});

/**
 * A JSON representation of a Conversation instance.
 */
export type ConversationModel = z.infer<typeof conversationSchema>;
