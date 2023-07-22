import { z } from "zod";
import { conversationConfigSchema } from "./conversationConfig.schema.js";
import { conversationRequestOptionsSchema } from "./conversationRequestOptions.schema.js";
import { conversationHistorySchema } from "./conversationHistory.schema.js";
import { conversationCallableFunctionsSchema } from "./conversationCallableFunctions.schema.js";

/**
 * A JSON representation of a Conversation instance.
 */
export const conversationSchema = z.object({
    id: z.string().uuid().optional(),
    history: conversationHistorySchema.optional(),
    config: conversationConfigSchema.optional(),
    callableFunctions: conversationCallableFunctionsSchema.optional(),
    requestOptions: conversationRequestOptionsSchema.optional(),
});

/**
 * A JSON representation of a Conversation instance.
 */
export type ConversationModel = z.infer<typeof conversationSchema>;
