import { z } from "nestjs-zod/z";

export const promptDtoSchema = z.object({
    prompt: z.string(),
});

export type PromptDto = z.infer<typeof promptDtoSchema>;
