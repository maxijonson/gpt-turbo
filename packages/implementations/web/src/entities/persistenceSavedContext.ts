import { z } from "zod";

export const persistenceSavedContextSchema = z.object({
    name: z.string().max(50).nonempty("Context name cannot be empty"),
    value: z.string(),
});

export type PersistenceSavedContext = z.infer<
    typeof persistenceSavedContextSchema
>;
