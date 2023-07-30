import { z } from "zod";
import { callableFunctionSchema } from "./callableFunction.schema.js";

export const conversationCallableFunctionsSchema = z.object({
    functions: z.array(callableFunctionSchema).optional(),
});

export type ConversationCallableFunctionsModel = z.infer<
    typeof conversationCallableFunctionsSchema
>;
