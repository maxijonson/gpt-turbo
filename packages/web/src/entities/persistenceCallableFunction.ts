import { jsonSchemaObjectSchema } from "gpt-turbo";
import { z } from "zod";

export const persistenceCallableFunctionSchema = z.object({
    id: z.string().uuid(),
    displayName: z.string().min(1),
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
    code: z.string().optional(),
});

export type PersistenceCallableFunction = z.infer<
    typeof persistenceCallableFunctionSchema
>;
