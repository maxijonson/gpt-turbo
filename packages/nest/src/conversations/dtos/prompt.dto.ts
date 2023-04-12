import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";

export const promptDtoSchema = z.object({
    prompt: z.string().min(1),
});

export type PromptDto = z.infer<typeof promptDtoSchema>;

export class PromptDtoEntity extends createZodDto(promptDtoSchema) {}
