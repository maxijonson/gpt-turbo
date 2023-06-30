import {
    JsonSchema,
    JsonSchemaBoolean,
    jsonSchemaBooleanSchema,
} from "../../schemas/jsonSchema.schema.js";
import { CallableFunctionParameter } from "./CallableFunctionParameter.js";

export class CallableFunctionBoolean extends CallableFunctionParameter<JsonSchemaBoolean> {
    readonly type = "boolean";

    constructor(name: string, options: Omit<JsonSchemaBoolean, "type"> = {}) {
        super(name, options);
    }

    static fromJSON(
        name: string,
        json: JsonSchemaBoolean
    ): CallableFunctionBoolean {
        const callableFunctionBooleanModel =
            jsonSchemaBooleanSchema.parse(json);
        const callableFunctionBoolean = new CallableFunctionBoolean(
            name,
            callableFunctionBooleanModel
        );
        return callableFunctionBoolean;
    }

    /**
     * Whether the given `JsonSchema` is a `JsonSchemaBoolean`.
     *
     * Note: This method does not check if the schema is valid, only if it has properties unique to boolean schemas.
     */
    static isBooleanSchema(json: JsonSchema): json is JsonSchemaBoolean {
        return (json as JsonSchemaBoolean).type === "boolean";
    }

    toJSON(): JsonSchemaBoolean {
        const json: JsonSchemaBoolean = {
            ...this.toJSONBase(),
            type: this.type,
        };
        return jsonSchemaBooleanSchema.parse(json);
    }
}
