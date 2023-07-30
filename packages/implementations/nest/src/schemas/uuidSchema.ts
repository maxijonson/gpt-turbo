import { z } from "nestjs-zod/z";

export const uuidSchema = z.string().uuid();

export type UUID = z.infer<typeof uuidSchema>;
