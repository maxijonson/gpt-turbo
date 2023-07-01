import {
    JsonSchema,
    JsonSchemaString,
    jsonSchemaStringSchema,
} from "../../schemas/jsonSchema.schema.js";
import { CallableFunctionParameter } from "./CallableFunctionParameter.js";

export class CallableFunctionString extends CallableFunctionParameter<JsonSchemaString> {
    readonly type = "string";

    minLength?: JsonSchemaString["minLength"];
    maxLength?: JsonSchemaString["maxLength"];
    pattern?: JsonSchemaString["pattern"];
    enum?: JsonSchemaString["enum"];
    format?: JsonSchemaString["format"];

    constructor(name: string, options: Omit<JsonSchemaString, "type"> = {}) {
        super(name, options);
        this.minLength = options.minLength;
        this.maxLength = options.maxLength;
        this.pattern = options.pattern;
        this.enum = options.enum;
        this.format = options.format;
    }

    static fromJSON(
        name: string,
        json: JsonSchemaString
    ): CallableFunctionString {
        const callableFunctionStringModel = jsonSchemaStringSchema.parse(json);
        const callableFunctionString = new CallableFunctionString(
            name,
            callableFunctionStringModel
        );
        return callableFunctionString;
    }

    /**
     * Whether the given `JsonSchema` is a `JsonSchemaString`.
     *
     * Note: This method does not check if the schema is valid, only if it has properties unique to string schemas.
     */
    static isStringSchema(json: JsonSchema): json is JsonSchemaString {
        return (json as JsonSchemaString).type === "string";
    }

    toJSON(): JsonSchemaString {
        const json: JsonSchemaString = {
            ...this.toJSONBase(),
            type: this.type,
            minLength: this.minLength,
            maxLength: this.maxLength,
            pattern: this.pattern,
            enum: this.enum,
            format: this.format,
        };
        return jsonSchemaStringSchema.parse(json);
    }
}
