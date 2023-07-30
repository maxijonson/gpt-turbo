import { z } from "zod";
import { persistenceCallableFunctionSchema } from "./persistenceCallableFunction";

export const persistenceCallableFunctionsSchema = z.object({
    functions: z
        .array(persistenceCallableFunctionSchema)
        .refine(
            (functions) => {
                const displayNames = functions.map((f) => f.displayName);
                return displayNames.length === new Set(displayNames).size;
            },
            {
                message: "Function display names must be unique",
                params: { field: "displayName" },
            }
        )
        .refine(
            (functions) => {
                const names = functions.map((f) => f.name);
                return names.length === new Set(names).size;
            },
            {
                message: "Function names must be unique",
                params: { field: "name" },
            }
        ),
    showFunctionsWarning: z.boolean().default(true),
    showFunctionsImportWarning: z.boolean().default(true),
});

export type PersistenceCallableFunctions = z.infer<
    typeof persistenceCallableFunctionsSchema
>;
