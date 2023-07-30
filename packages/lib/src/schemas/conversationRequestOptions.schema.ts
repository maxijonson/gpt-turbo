import { z } from "zod";

/**
 * A JSON representation of a ConversationRequestOptions instance.
 */
export const conversationRequestOptionsSchema = z.object({
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
});

/**
 * A JSON representation of a ConversationRequestOptions instance.
 */
export type ConversationRequestOptionsModel = z.infer<
    typeof conversationRequestOptionsSchema
>;
