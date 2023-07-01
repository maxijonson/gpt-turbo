import {
    JsonSchema,
    JsonSchemaNull,
    jsonSchemaNullSchema,
} from "../../schemas/jsonSchema.schema.js";
import { CallableFunctionParameter } from "./CallableFunctionParameter.js";

export class CallableFunctionNull extends CallableFunctionParameter<JsonSchemaNull> {
    readonly type = "null";

    constructor(name: string, options: Omit<JsonSchemaNull, "type"> = {}) {
        super(name, options);
    }

    static fromJSON(name: string, json: JsonSchemaNull): CallableFunctionNull {
        const callableFunctionNullModel = jsonSchemaNullSchema.parse(json);
        const callableFunctionNull = new CallableFunctionNull(
            name,
            callableFunctionNullModel
        );
        return callableFunctionNull;
    }

    /**
     * Whether the given `JsonSchema` is a `JsonSchemaNull`.
     *
     * Note: This method does not check if the schema is valid, only if it has properties unique to null schemas.
     */
    static isNullSchema(json: JsonSchema): json is JsonSchemaNull {
        return (json as JsonSchemaNull).type === "null";
    }

    toJSON(): JsonSchemaNull {
        const json: JsonSchemaNull = {
            ...this.toJSONBase(),
            type: this.type,
        };
        return jsonSchemaNullSchema.parse(json);
    }
}
