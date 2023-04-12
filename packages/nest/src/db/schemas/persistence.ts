import { z } from "nestjs-zod/z";
import { persistenceConversationSchema } from "./persistenceConversation.js";

export const persistenceSchema = z.object({
    conversations: z.array(persistenceConversationSchema),
});

export type Persistence = z.infer<typeof persistenceSchema>;
