import { z } from "nestjs-zod/z";
import { uuidSchema } from "../../schemas/uuidSchema.js";
import { createZodDto } from "nestjs-zod";

export const messageDtoSchema = z.object({
    id: uuidSchema,
    content: z.string(),
    role: z.string(),
    cost: z.number(),
    size: z.number(),
    isFlagged: z.boolean(),
    isStreaming: z.boolean(),
    flags: z.array(z.string()).or(z.null()),
});

export type MessageDto = z.infer<typeof messageDtoSchema>;

export class MessageDtoEntity extends createZodDto(messageDtoSchema) {}
