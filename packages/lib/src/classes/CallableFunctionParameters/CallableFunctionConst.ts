import {
    JsonSchema,
    JsonSchemaConst,
    jsonSchemaConstSchema,
} from "../../schemas/jsonSchema.schema.js";
import { CallableFunctionParameter } from "./CallableFunctionParameter.js";

export class CallableFunctionConst extends CallableFunctionParameter<JsonSchemaConst> {
    /** Not part of the JSON schema specification */
    readonly type = "const";

    const: JsonSchemaConst["const"];

    constructor(
        name: string,
        constValues: JsonSchemaConst["const"],
        options: Omit<JsonSchemaConst, "const"> = {}
    ) {
        super(name, options);
        this.const = constValues;
    }

    static fromJSON(
        name: string,
        json: JsonSchemaConst
    ): CallableFunctionConst {
        const callableFunctionConstModel = jsonSchemaConstSchema.parse(json);
        const callableFunctionConst = new CallableFunctionConst(
            name,
            callableFunctionConstModel.const,
            callableFunctionConstModel
        );
        return callableFunctionConst;
    }

    /**
     * Whether the given `JsonSchema` is a `JsonSchemaConst`.
     *
     * Note: This method does not check if the schema is valid, only if it has properties unique to const schemas.
     */
    static isConstSchema(json: JsonSchema): json is JsonSchemaConst {
        return (json as JsonSchemaConst).const !== undefined;
    }

    toJSON(): JsonSchemaConst {
        const json: JsonSchemaConst = {
            ...this.toJSONBase(),
            const: this.const,
        };
        return jsonSchemaConstSchema.parse(json);
    }
}
