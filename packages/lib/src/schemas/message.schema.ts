import { z } from "zod";

/**
 * A JSON schema for a Message instance.
 */
export const messageSchema = z.object({
    id: z.string().uuid().optional(),
    role: z.union([
        z.literal("user"),
        z.literal("assistant"),
        z.literal("system"),
        z.literal("function"),
    ]),
    content: z.string().nullable(),
    name: z.string().min(1).optional(),
    function_call: z
        .object({
            name: z.string().min(1),
            arguments: z.record(z.any()),
        })
        .optional(),
    model: z.string().optional(),
    flags: z.array(z.string()).or(z.null()).optional(),
});

/**
 * A JSON representation of a Message instance.
 */
export type MessageModel = z.infer<typeof messageSchema>;
