import { z } from "zod";

export const persistenceSavedPromptSchema = z.object({
    name: z.string().max(50).min(1),
    value: z.string(),
});

export type PersistenceSavedPrompt = z.infer<
    typeof persistenceSavedPromptSchema
>;
