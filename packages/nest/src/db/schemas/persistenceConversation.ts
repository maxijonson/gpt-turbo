import { z } from "nestjs-zod/z";
import { persistenceMessageSchema } from "./persistenceMessage.js";

export const persistenceConversationSchema = z.object({
    messages: z.array(persistenceMessageSchema).default([]),

    context: z.string().optional(),
    dry: z.boolean().optional(),
    disableModeration: z.boolean().or(z.literal("soft")).optional(),

    apiKey: z.string().optional(),
    model: z.string().optional(),
    stream: z.boolean().optional(),
    frequency_penalty: z.number().optional(),
    presence_penalty: z.number().optional(),
    max_tokens: z.number().optional(),
    logit_bias: z.record(z.number(), z.number()).optional(),
    stop: z.string().or(z.array(z.string())).or(z.null()).optional(),
    temperature: z.number().optional(),
    top_p: z.number().optional(),
    user: z.string().optional(),
});

export type PersistenceConversation = z.infer<
    typeof persistenceConversationSchema
>;
