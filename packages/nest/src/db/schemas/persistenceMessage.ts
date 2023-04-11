import { z } from "zod";

export const persistenceMessageSchema = z.object({
    content: z.string(),
    role: z.enum(["user", "system", "assistant"]),
});

export type PersistenceMessage = z.infer<typeof persistenceMessageSchema>;
