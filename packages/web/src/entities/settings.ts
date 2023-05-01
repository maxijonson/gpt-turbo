import { z } from "zod";

export const settingsSchema = z.object({
    apiKey: z.string(),
    model: z.string(),
    context: z.string(),
    dry: z.boolean(),
    disableModeration: z.boolean().or(z.literal("soft")),
    stream: z.boolean(),
    save: z.boolean(),
});

export type Settings = z.infer<typeof settingsSchema>;
