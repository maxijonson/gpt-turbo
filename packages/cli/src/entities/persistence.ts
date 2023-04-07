import { z } from "zod";
import { persistenceConversationSchema } from "./persistenceConversation.js";

export const persistenceSchema = z.object({
    conversation: persistenceConversationSchema,
});

export type Persistence = z.infer<typeof persistenceSchema>;
