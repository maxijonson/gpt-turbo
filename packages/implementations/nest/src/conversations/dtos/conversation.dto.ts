import { z } from "nestjs-zod/z";
import { messageDtoSchema } from "./message.dto.js";
import { createZodDto } from "nestjs-zod";
import { conversationConfigDtoSchema } from "./conversationConfig.dto.js";

export const conversationDtoSchema = z.object({
    id: z.string(),
    config: conversationConfigDtoSchema,
    messages: z.array(messageDtoSchema).min(0),
    cost: z.number(),
    size: z.number(),
    cumulativeCost: z.number(),
    cumulativeSize: z.number(),
});

export type ConversationDto = z.infer<typeof conversationDtoSchema>;

export class ConversationDtoEntity extends createZodDto(
    conversationDtoSchema
) {}
