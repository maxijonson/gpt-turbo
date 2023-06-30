import { z } from "zod";

export const javascriptIdentifierSchema = z
    .string()
    .min(1)
    .regex(/^[a-zA-Z0-9_$]+$/, "Must be a valid JavaScript identifier");
