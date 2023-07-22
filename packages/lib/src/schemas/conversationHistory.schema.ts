import { z } from "zod";
import { messageSchema } from "./message.schema.js";

export const conversationHistorySchema = z.object({
    messages: z.array(messageSchema).optional(),
});

export type ConversationHistoryModel = z.infer<
    typeof conversationHistorySchema
>;
