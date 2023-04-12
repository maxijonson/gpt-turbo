import {
    DEFAULT_MODEL,
    DEFAULT_STREAM,
    DEFAULT_CONTEXT,
    DEFAULT_DRY,
    DEFAULT_DISABLEMODERATION,
} from "gpt-turbo";
import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

export const conversationConfigDtoSchema = z.object({
    model: z.string().default(DEFAULT_MODEL),
    temperature: z.number().min(0).max(2).default(1),
    top_p: z.number().min(0).max(1).default(1),
    stream: z.boolean().default(DEFAULT_STREAM),
    stop: z.string().or(z.array(z.string()).max(4)).or(z.null()).default(null),
    max_tokens: z.number().min(1).max(2048).default(2048),
    presence_penalty: z.number().min(-2).max(2).default(0),
    frequency_penalty: z.number().min(-2).max(2).default(0),
    logit_bias: z.record(z.number(), z.number()).default({}),
    user: z.string().default(""),

    context: z.string().default(DEFAULT_CONTEXT),
    dry: z.boolean().default(DEFAULT_DRY),
    disableModeration: z
        .boolean()
        .or(z.literal("soft"))
        .default(DEFAULT_DISABLEMODERATION),
});

export type ConversationConfigDto = z.infer<typeof conversationConfigDtoSchema>;

export class ConversationConfigDtoEntity extends createZodDto(
    conversationConfigDtoSchema
) {}
