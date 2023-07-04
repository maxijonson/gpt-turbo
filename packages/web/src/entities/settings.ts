import {
    conversationConfigSchema,
    conversationSchema,
    DEFAULT_CONTEXT,
    DEFAULT_DISABLEMODERATION,
    DEFAULT_DRY,
    DEFAULT_MODEL,
    DEFAULT_STREAM,
} from "gpt-turbo";
import { z } from "zod";

export const settingsSchema = z.object({
    version: z.string().min(1),

    save: z.boolean().default(false),

    apiKey: conversationConfigSchema.shape.apiKey.default(""),
    model: conversationConfigSchema.shape.model.default(DEFAULT_MODEL),
    context: conversationConfigSchema.shape.context.default(DEFAULT_CONTEXT),
    dry: conversationConfigSchema.shape.dry.default(DEFAULT_DRY),
    disableModeration: conversationConfigSchema.shape.disableModeration.default(
        DEFAULT_DISABLEMODERATION
    ),
    stream: conversationConfigSchema.shape.stream.default(DEFAULT_STREAM),

    temperature: conversationConfigSchema.shape.temperature,
    top_p: conversationConfigSchema.shape.top_p,
    frequency_penalty: conversationConfigSchema.shape.frequency_penalty,
    presence_penalty: conversationConfigSchema.shape.presence_penalty,
    stop: conversationConfigSchema.shape.stop,
    max_tokens: conversationConfigSchema.shape.max_tokens,
    logit_bias: conversationConfigSchema.shape.logit_bias,
    user: conversationConfigSchema.shape.user,

    functionIds: z.array(z.string()).default([]),

    headers: conversationSchema.shape.requestOptions.unwrap().shape.headers,
    proxy: conversationSchema.shape.requestOptions.unwrap().shape.proxy,
});

export type Settings = z.infer<typeof settingsSchema>;
