import { conversationConfigSchema } from "gpt-turbo";
import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

export const conversationConfigDtoSchema = conversationConfigSchema;

export type ConversationConfigDto = z.infer<typeof conversationConfigDtoSchema>;

export class ConversationConfigDtoEntity extends createZodDto(
    conversationConfigDtoSchema
) {}
