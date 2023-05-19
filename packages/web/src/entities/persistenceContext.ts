import { z } from "zod";

export const persistenceContextSchema = z.object({
    name: z.string().max(50).min(1),
    value: z.string(),
});

export type PersistenceContext = z.infer<typeof persistenceContextSchema>;
