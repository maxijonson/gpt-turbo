import { z } from "nestjs-zod/z";
import { createZodDto } from "nestjs-zod";
import { conversationSchema } from "gpt-turbo";

export const conversationDtoSchema = conversationSchema;

export type ConversationDto = z.infer<typeof conversationDtoSchema>;

export class ConversationDtoEntity extends createZodDto(
    conversationDtoSchema
) {}
