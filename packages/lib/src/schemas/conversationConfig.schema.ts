import { z } from "zod";

/**
 * A JSON representation of a ConversationConfig instance.
 */
export const conversationConfigSchema = z.object({
    context: z.string().optional(),
    dry: z.boolean().optional(),
    disableModeration: z.boolean().or(z.literal("soft")).optional(),
    apiKey: z.string().optional().optional(),
    model: z.string().optional(),
    temperature: z.number().optional(),
    top_p: z.number().optional(),
    stream: z.boolean().optional(),
    stop: z.string().or(z.array(z.string())).or(z.null()).optional(),
    max_tokens: z.number().optional(),
    presence_penalty: z.number().optional(),
    frequency_penalty: z.number().optional(),
    logit_bias: z.record(z.number(), z.number()).optional(),
    user: z.string().optional(),
});

/**
 * A JSON representation of a ConversationConfig instance.
 */
export type ConversationConfigModel = z.infer<typeof conversationConfigSchema>;
