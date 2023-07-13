import { z } from "zod";
import { persistenceSavedContextSchema } from "./persistenceSavedContext";

export const persistenceSavedContextsSchema = z
    .array(persistenceSavedContextSchema)
    .refine((contexts) => {
        const names = contexts.map((c) => c.name.toLowerCase());
        return names.length === new Set(names).size;
    }, "Context names must be unique");

export type PersistenceSavedContexts = z.infer<
    typeof persistenceSavedContextsSchema
>;
