import { z } from "zod";
import { persistenceSavedPromptSchema } from "./persistenceSavedPrompt";

export const persistenceSavedPromptsSchema = z
    .array(persistenceSavedPromptSchema)
    .refine((prompts) => {
        const names = prompts.map((p) => p.name.toLowerCase());
        return names.length === new Set(names).size;
    }, "Prompt names must be unique");

export type PersistenceSavedPrompts = z.infer<
    typeof persistenceSavedPromptsSchema
>;
