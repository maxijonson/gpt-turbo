import { z } from "zod";

export const persistenceAppSettingsSchema = z.object({
    showUsage: z.boolean().default(false),
    colorScheme: z
        .union([z.literal("light"), z.literal("dark")])
        .default("light"),
    lastChangelog: z.string().default(""),
    showConversationImport: z.boolean().default(true),
});

export type PersistenceAppSettings = z.infer<
    typeof persistenceAppSettingsSchema
>;
