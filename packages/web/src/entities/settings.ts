import { z } from "zod";

export const settingsSchema = z.object({
    apiKey: z.string(),
});

export type Settings = z.infer<typeof settingsSchema>;
