import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

export const repromptDtoSchema = z.object({
    prompt: z.string().min(1).optional(),
});

export type RepromptDto = z.infer<typeof repromptDtoSchema>;

export class RepromptDtoEntity extends createZodDto(repromptDtoSchema) {}
