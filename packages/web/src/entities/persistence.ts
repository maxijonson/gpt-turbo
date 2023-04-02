import { z } from "zod";
import { persistenceConversationSchema } from "./persistenceConversation";

export const persistenceSchema = z.object({
    conversations: z.array(persistenceConversationSchema),
});

export type Persistence = z.infer<typeof persistenceSchema>;
