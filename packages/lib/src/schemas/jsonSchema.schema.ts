import { z } from "zod";

// The following Zod schemas are all based on the JSON Schema specification and may not be complete:
// https://json-schema.org/understanding-json-schema/reference/index.html

// -------------------- Base --------------------
export const jsonSchemaBaseSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    default: z.any().optional(),
    examples: z.array(z.any()).optional(),
    readOnly: z.boolean().optional(),
    writeOnly: z.boolean().optional(),
    deprecated: z.boolean().optional(),
    $comment: z.string().optional(),
});

export type JsonSchemaBase = z.infer<typeof jsonSchemaBaseSchema>;

// -------------------- String --------------------

export const jsonSchemaStringSchema = jsonSchemaBaseSchema.extend({
    type: z.literal("string"),
    minLength: z.number().optional(),
    maxLength: z.number().optional(),
    pattern: z.string().optional(),
    enum: z.array(z.string()).optional(),
    format: z
        .union([
            z.literal("date-time"),
            z.literal("time"),
            z.literal("date"),
            z.literal("duration"),
            z.literal("email"),
            z.literal("idn-email"),
            z.literal("hostname"),
            z.literal("idn-hostname"),
            z.literal("ipv4"),
            z.literal("ipv6"),
            z.literal("uuid"),
            z.literal("uri"),
            z.literal("uri-reference"),
            z.literal("iri"),
            z.literal("iri-reference"),
            z.literal("uri-template"),
            z.literal("json-pointer"),
            z.literal("relative-json-pointer"),
            z.literal("regex"),
        ])
        .optional(),
});

export type JsonSchemaString = z.infer<typeof jsonSchemaStringSchema>;

// -------------------- Number --------------------

export const jsonSchemaNumberSchema = jsonSchemaBaseSchema.extend({
    type: z.literal("number"),
    multipleOf: z.number().optional(),
    minimum: z.number().optional(),
    exclusiveMinimum: z.union([z.number(), z.boolean()]).optional(),
    maximum: z.number().optional(),
    exclusiveMaximum: z.union([z.number(), z.boolean()]).optional(),
});

export type JsonSchemaNumber = z.infer<typeof jsonSchemaNumberSchema>;

// -------------------- Boolean --------------------

export const jsonSchemaBooleanSchema = jsonSchemaBaseSchema.extend({
    type: z.literal("boolean"),
});

export type JsonSchemaBoolean = z.infer<typeof jsonSchemaBooleanSchema>;

// -------------------- Null --------------------

export const jsonSchemaNullSchema = jsonSchemaBaseSchema.extend({
    type: z.literal("null"),
});

export type JsonSchemaNull = z.infer<typeof jsonSchemaNullSchema>;

// -------------------- Enum --------------------

export const jsonSchemaEnumSchema = jsonSchemaBaseSchema.extend({
    enum: z.array(z.union([z.string(), z.number(), z.boolean(), z.null()])),
});

export type JsonSchemaEnum = z.infer<typeof jsonSchemaEnumSchema>;

// -------------------- Const --------------------

export const jsonSchemaConstSchema = jsonSchemaBaseSchema.extend({
    const: z.union([z.string(), z.number(), z.boolean(), z.null()]),
});

export type JsonSchemaConst = z.infer<typeof jsonSchemaConstSchema>;

// -------------------- Object (without recursive types) --------------------

export const baseJsonSchemaObjectSchema = jsonSchemaBaseSchema.extend({
    type: z.literal("object"),
    required: z.array(z.string()).optional(),
    unevaluatedProperties: z.boolean().optional(),
    minProperties: z.number().optional(),
    maxProperties: z.number().optional(),
});

export type BaseJsonSchemaObject = z.infer<typeof baseJsonSchemaObjectSchema>;

// -------------------- Array (without recursive types) --------------------

export const baseJsonSchemaArraySchema = jsonSchemaBaseSchema.extend({
    type: z.literal("array"),
    minContains: z.number().optional(),
    maxContains: z.number().optional(),
    minItems: z.number().optional(),
    maxItems: z.number().optional(),
    uniqueItems: z.boolean().optional(),
});

export type BaseJsonSchemaArray = z.infer<typeof baseJsonSchemaArraySchema>;

// -------------------- JSON --------------------

export const baseJsonSchemaSchema = z.union([
    jsonSchemaStringSchema,
    jsonSchemaNumberSchema,
    jsonSchemaBooleanSchema,
    jsonSchemaNullSchema,
    jsonSchemaEnumSchema,
    jsonSchemaConstSchema,
]);

// Manually define the recursive types
export type JsonSchema =
    | z.infer<typeof baseJsonSchemaSchema>
    | (BaseJsonSchemaObject & {
          properties?: Record<string, JsonSchema>;
          patternProperties?: Record<string, JsonSchema>;
          additionalProperties?: boolean | JsonSchema;
      })
    | (BaseJsonSchemaArray & {
          items?: JsonSchema | boolean;
          prefixItems?: JsonSchema[];
          contains?: JsonSchema;
      });

// Define the recursive types using zod's "lazy" function
export const jsonSchemaSchema: z.ZodType<JsonSchema> = z.union([
    baseJsonSchemaSchema,
    baseJsonSchemaObjectSchema.extend({
        properties: z.record(z.lazy(() => jsonSchemaSchema)).optional(),
        patternProperties: z.record(z.lazy(() => jsonSchemaSchema)).optional(),
        additionalProperties: z
            .union([z.boolean(), z.lazy(() => jsonSchemaSchema)])
            .optional(),
    }),
    baseJsonSchemaArraySchema.extend({
        items: z
            .union([z.lazy(() => jsonSchemaSchema), z.boolean()])
            .optional(),
        prefixItems: z.array(z.lazy(() => jsonSchemaSchema)).optional(),
        contains: z.lazy(() => jsonSchemaSchema).optional(),
    }),
]);

// -------------------- Object --------------------

export const jsonSchemaObjectSchema = baseJsonSchemaObjectSchema.extend({
    properties: z.record(jsonSchemaSchema).optional(),
    patternProperties: z.record(jsonSchemaSchema).optional(),
    additionalProperties: z.union([z.boolean(), jsonSchemaSchema]).optional(),
});

export type JsonSchemaObject = z.infer<typeof jsonSchemaObjectSchema>;

// -------------------- Array --------------------

export const jsonSchemaArraySchema = baseJsonSchemaArraySchema.extend({
    items: z.union([jsonSchemaSchema, z.boolean()]).optional(),
    prefixItems: z.array(jsonSchemaSchema).optional(),
    contains: jsonSchemaSchema.optional(),
});

export type JsonSchemaArray = z.infer<typeof jsonSchemaArraySchema>;
