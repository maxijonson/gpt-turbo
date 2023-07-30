import { z } from "nestjs-zod/z";
import { createZodDto } from "nestjs-zod";
import { messageSchema } from "gpt-turbo";

export const messageDtoSchema = messageSchema;

export type MessageDto = z.infer<typeof messageDtoSchema>;

export class MessageDtoEntity extends createZodDto(messageDtoSchema) {}
