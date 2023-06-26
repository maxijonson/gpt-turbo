import { z } from "zod";
import { jsonSchemaObjectSchema } from "./jsonSchema.schema.js";

export const callableFunctionSchema = z.object({
    id: z.string().uuid().optional(),
    name: z
        .string()
        .min(1)
        .max(64)
        .regex(
            /^[a-zA-Z0-9_-]+$/,
            "Function name can only contain letters, numbers, underscores, and dashes."
        ),
    description: z.string().min(1).optional(),
    parameters: jsonSchemaObjectSchema.optional(),
});

export type CallableFunctionModel = z.infer<typeof callableFunctionSchema>;
