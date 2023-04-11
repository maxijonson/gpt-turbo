import { z } from "nestjs-zod/z";
import { persistenceMessageSchema } from "./persistenceMessage.js";

export const persistenceConversationSchema = z.object({
    messages: z.array(persistenceMessageSchema),

    context: z.string(),
    dry: z.boolean(),
    disableModeration: z.boolean().or(z.literal("soft")),

    apiKey: z.string(),
    model: z.string(),
    stream: z.boolean(),
    frequency_penalty: z.number().optional(),
    presence_penalty: z.number().optional(),
    max_tokens: z.number().optional(),
    logit_bias: z.record(z.number(), z.number()).optional(),
    stop: z.string().or(z.array(z.string())).optional(),
    temperature: z.number().optional(),
    top_p: z.number().optional(),
    user: z.string().optional(),
});

export type PersistenceConversation = z.infer<
    typeof persistenceConversationSchema
>;
