import { z } from "zod";
import { persistenceConversationSchema } from "./persistenceConversation";
import { persistenceContextSchema } from "./persistenceContext";
import { persistencePromptSchema } from "./persistencePrompt";

export const persistenceSchema = z.object({
    conversations: z.array(persistenceConversationSchema),
    contexts: z.array(persistenceContextSchema).refine((contexts) => {
        const names = contexts.map((c) => c.name.toLowerCase());
        return names.length === new Set(names).size;
    }, "Context names must be unique"),
    prompts: z.array(persistencePromptSchema).refine((prompts) => {
        const names = prompts.map((p) => p.name.toLowerCase());
        return names.length === new Set(names).size;
    }, "Prompt names must be unique"),
});

export type Persistence = z.infer<typeof persistenceSchema>;
