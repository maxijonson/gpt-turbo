import {
    JsonSchema,
    JsonSchemaEnum,
    jsonSchemaEnumSchema,
} from "../../schemas/jsonSchema.schema.js";
import { CallableFunctionParameter } from "./CallableFunctionParameter.js";

export class CallableFunctionEnum extends CallableFunctionParameter<JsonSchemaEnum> {
    /** Not part of the JSON schema specification */
    readonly type = "enum";

    enum: JsonSchemaEnum["enum"];

    constructor(
        name: string,
        enumValues: JsonSchemaEnum["enum"],
        options: Omit<JsonSchemaEnum, "enum"> = {}
    ) {
        super(name, options);
        this.enum = enumValues;
    }

    static fromJSON(name: string, json: JsonSchemaEnum): CallableFunctionEnum {
        const callableFunctionEnumModel = jsonSchemaEnumSchema.parse(json);
        const callableFunctionEnum = new CallableFunctionEnum(
            name,
            callableFunctionEnumModel.enum,
            callableFunctionEnumModel
        );
        return callableFunctionEnum;
    }

    /**
     * Whether the given `JsonSchema` is a `JsonSchemaEnum`.
     *
     * Note: This method does not check if the schema is valid, only if it has properties unique to enum schemas.
     */
    static isEnumSchema(json: JsonSchema): json is JsonSchemaEnum {
        return (
            (json as JsonSchemaEnum).enum !== undefined &&
            (json as any).type === undefined
        );
    }

    toJSON(): JsonSchemaEnum {
        const json: JsonSchemaEnum = {
            ...this.toJSONBase(),
            enum: this.enum,
        };
        return jsonSchemaEnumSchema.parse(json);
    }
}
