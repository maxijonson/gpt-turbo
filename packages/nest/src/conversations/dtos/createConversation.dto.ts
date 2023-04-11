import { z } from "zod";

export const createConversationDtoSchema = z.object({
    apiKey: z.string().optional(),
    model: z.string().optional(),
    temperature: z.number().min(0).max(2).optional(),
    top_p: z.number().min(0).max(1).optional(),
    stream: z.boolean().optional(),
    stop: z.string().or(z.array(z.string()).max(4)).optional(),
    presence_penalty: z.number().min(-2).max(2).optional(),
    frequency_penalty: z.number().min(-2).max(2).optional(),
    logit_bias: z.record(z.number(), z.number()).optional(),
    user: z.string().optional(),

    context: z.string().optional(),
    dry: z.boolean().optional(),
    disableModeration: z.boolean().or(z.literal("soft")).optional(),
});

export type CreateConversationDto = z.infer<typeof createConversationDtoSchema>;
