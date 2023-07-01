import {
    JsonSchema,
    JsonSchemaNumber,
    jsonSchemaNumberSchema,
} from "../../schemas/jsonSchema.schema.js";
import { CallableFunctionParameter } from "./CallableFunctionParameter.js";

export class CallableFunctionNumber extends CallableFunctionParameter<JsonSchemaNumber> {
    readonly type = "number";

    multipleOf?: JsonSchemaNumber["multipleOf"];
    minimum?: JsonSchemaNumber["minimum"];
    exclusiveMinimum?: JsonSchemaNumber["exclusiveMinimum"];
    maximum?: JsonSchemaNumber["maximum"];
    exclusiveMaximum?: JsonSchemaNumber["exclusiveMaximum"];

    constructor(name: string, options: Omit<JsonSchemaNumber, "type"> = {}) {
        super(name, options);
        this.multipleOf = options.multipleOf;
        this.minimum = options.minimum;
        this.exclusiveMinimum = options.exclusiveMinimum;
        this.maximum = options.maximum;
        this.exclusiveMaximum = options.exclusiveMaximum;
    }

    static fromJSON(
        name: string,
        json: JsonSchemaNumber
    ): CallableFunctionNumber {
        const callableFunctionNumberModel = jsonSchemaNumberSchema.parse(json);
        const callableFunctionNumber = new CallableFunctionNumber(
            name,
            callableFunctionNumberModel
        );
        return callableFunctionNumber;
    }

    /**
     * Whether the given `JsonSchema` is a `JsonSchemaNumber`.
     *
     * Note: This method does not check if the schema is valid, only if it has properties unique to number schemas.
     */
    static isNumberSchema(json: JsonSchema): json is JsonSchemaNumber {
        return (json as JsonSchemaNumber).type === "number";
    }

    toJSON(): JsonSchemaNumber {
        const json: JsonSchemaNumber = {
            ...this.toJSONBase(),
            type: this.type,
            multipleOf: this.multipleOf,
            minimum: this.minimum,
            exclusiveMinimum: this.exclusiveMinimum,
            maximum: this.maximum,
            exclusiveMaximum: this.exclusiveMaximum,
        };
        return jsonSchemaNumberSchema.parse(json);
    }
}
