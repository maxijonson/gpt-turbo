import { z } from "zod";
import { persistenceConversationSchema } from "./persistenceConversation";
import { persistenceContextSchema } from "./persistenceContext";
import { persistencePromptSchema } from "./persistencePrompt";
import { persistenceCallableFunctionSchema } from "./persistenceCallableFunction";

export const persistenceSchema = z.object({
    version: z.number(),
    conversations: z.array(persistenceConversationSchema),
    contexts: z.array(persistenceContextSchema).refine((contexts) => {
        const names = contexts.map((c) => c.name.toLowerCase());
        return names.length === new Set(names).size;
    }, "Context names must be unique"),
    prompts: z.array(persistencePromptSchema).refine((prompts) => {
        const names = prompts.map((p) => p.name.toLowerCase());
        return names.length === new Set(names).size;
    }, "Prompt names must be unique"),
    functionsWarning: z.boolean().default(true),
    functionsImportWarning: z.boolean().default(true),
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
});

export type Persistence = z.infer<typeof persistenceSchema>;
