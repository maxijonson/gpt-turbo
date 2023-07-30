import { z } from "zod";
import { persistenceConversationSchema } from "./persistenceConversation";
import { persistenceDefaultSettingsSchema } from "./persistenceDefaultSettings";
import { persistenceCallableFunctionsSchema } from "./persistenceCallableFunctions";
import { persistenceSavedContextsSchema } from "./persistenceSavedContexts";
import { persistenceSavedPromptsSchema } from "./persistenceSavedPrompts";
import { persistenceAppSettingsSchema } from "./persistenceAppSettings";

export const persistenceSchema = z.object({
    appSettings: persistenceAppSettingsSchema,
    callableFunctions: persistenceCallableFunctionsSchema,
    conversations: z.array(persistenceConversationSchema),
    defaultSettings: persistenceDefaultSettingsSchema,
    savedContexts: persistenceSavedContextsSchema,
    savedPrompts: persistenceSavedPromptsSchema,
});

export type Persistence = z.infer<typeof persistenceSchema>;
