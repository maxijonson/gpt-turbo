import { callableFunctionSchema } from "gpt-turbo";
import { z } from "zod";

export const persistenceCallableFunctionSchema = callableFunctionSchema.extend({
    displayName: z.string().nonempty("Function display name cannot be empty"),
    code: z.string().optional(),
});

export type PersistenceCallableFunction = z.infer<
    typeof persistenceCallableFunctionSchema
>;
