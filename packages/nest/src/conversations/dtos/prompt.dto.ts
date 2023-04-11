import { createZodDto } from "nestjs-zod";
import { z } from "nestjs-zod/z";
import { messageDtoSchema } from "./message.dto.js";

export const promptDtoSchema = z.object({
    prompt: z.string().min(1),
});

export type PromptDto = z.infer<typeof promptDtoSchema>;

export class PromptDtoEntity extends createZodDto(promptDtoSchema) {}

export const promptResponseDtoSchema = messageDtoSchema;

export type PromptResponseDto = z.infer<typeof promptResponseDtoSchema>;
