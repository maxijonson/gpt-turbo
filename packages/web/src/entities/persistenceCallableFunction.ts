import { callableFunctionSchema } from "gpt-turbo";
import { z } from "zod";

export const persistenceCallableFunctionSchema = callableFunctionSchema.extend({
    displayName: z.string().min(1),
    code: z.string().optional(),
});

export type PersistenceCallableFunction = z.infer<
    typeof persistenceCallableFunctionSchema
>;
