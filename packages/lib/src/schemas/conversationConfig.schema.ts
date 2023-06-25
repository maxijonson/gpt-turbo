import { z } from "zod";
import { jsonSchemaObjectSchema } from "./jsonSchema.schema.js";

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
    logit_bias: z
        .record(
            z.string().refine((val) => !isNaN(Number(val))),
            z.number()
        )
        .optional(),
    user: z.string().optional(),
    functions: z
        .array(
            z.object({
                name: z
                    .string()
                    .min(1)
                    .max(64)
                    .regex(
                        /^[a-zA-Z0-9_-]+$/,
                        "Function name can only contain letters, numbers, underscores, and dashes."
                    ),
                description: z.string().min(1).optional(),
                properties: jsonSchemaObjectSchema.optional(),
            })
        )
        .optional(),
    function_call: z
        .union([
            z.literal("none"),
            z.literal("auto"),
            z.object({
                name: z.string().min(1),
            }),
        ])
        .optional(),
});

/**
 * A JSON representation of a ConversationConfig instance.
 */
export type ConversationConfigModel = z.infer<typeof conversationConfigSchema>;
