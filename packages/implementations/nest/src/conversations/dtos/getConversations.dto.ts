import { z } from "nestjs-zod/z";
import { conversationDtoSchema } from "./conversation.dto.js";

export const getConversationsResponseDtoSchema = z.array(conversationDtoSchema);

export type GetConversationsResponseDto = z.infer<
    typeof getConversationsResponseDtoSchema
>;
