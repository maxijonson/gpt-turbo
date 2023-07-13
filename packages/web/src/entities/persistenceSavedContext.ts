import { z } from "zod";

export const persistenceSavedContextSchema = z.object({
    name: z.string().max(50).min(1),
    value: z.string(),
});

export type PersistenceSavedContext = z.infer<
    typeof persistenceSavedContextSchema
>;
