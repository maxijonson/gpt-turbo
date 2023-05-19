import { z } from "zod";

export const persistencePromptSchema = z.object({
    name: z.string().max(50).min(1),
    value: z.string(),
});

export type PersistencePrompt = z.infer<typeof persistencePromptSchema>;
