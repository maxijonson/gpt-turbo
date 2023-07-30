import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
import { uuidSchema } from "../../schemas/uuidSchema.js";
import { conversationConfigDtoSchema } from "./conversationConfig.dto.js";

export const createConversationDtoSchema = conversationConfigDtoSchema.extend({
    apiKey: z.string().default(""),
});

export type CreateConversationDto = z.infer<typeof createConversationDtoSchema>;

export class CreateConversationDtoEntity extends createZodDto(
    createConversationDtoSchema
) {}

export const createConversationResponseDtoSchema = z.object({
    id: uuidSchema,
});

export type CreateConversationResponseDto = z.infer<
    typeof createConversationResponseDtoSchema
>;
