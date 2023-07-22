import { JsonSchemaObject } from "../../schemas/jsonSchema.schema.js";

/**
 * A function that can be called by the model.
 */
export interface CreateChatCompletionFunction {
    name: string;
    description?: string;
    parameters?: JsonSchemaObject;
}
