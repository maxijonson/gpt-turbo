import { z } from "zod";

export const persistenceSavedPromptSchema = z.object({
    name: z.string().max(50).nonempty("Prompt name cannot be empty"),
    value: z.string(),
});

export type PersistenceSavedPrompt = z.infer<
    typeof persistenceSavedPromptSchema
>;
