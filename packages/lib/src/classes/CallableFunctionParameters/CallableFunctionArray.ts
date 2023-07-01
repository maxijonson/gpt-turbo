import {
    JsonSchemaArray,
    JsonSchema,
    jsonSchemaArraySchema,
} from "../../schemas/jsonSchema.schema.js";
import { CallableFunctionParameter } from "./CallableFunctionParameter.js";
import { CallableFunctionParameterFactory } from "./CallableFunctionParameterFactory.js";

export class CallableFunctionArray extends CallableFunctionParameter<JsonSchemaArray> {
    readonly type = "array";

    minContains?: JsonSchemaArray["minContains"];
    maxContains?: JsonSchemaArray["maxContains"];
    minItems?: JsonSchemaArray["minItems"];
    maxItems?: JsonSchemaArray["maxItems"];
    uniqueItems?: JsonSchemaArray["uniqueItems"];

    items?: boolean | CallableFunctionParameter;
    prefixItems?: CallableFunctionParameter[];
    contains?: CallableFunctionParameter;

    constructor(
        name: string,
        options: Omit<JsonSchemaArray, "type" | "items"> = {}
    ) {
        super(name, options);
        this.minContains = options.minContains;
        this.maxContains = options.maxContains;
        this.minItems = options.minItems;
        this.maxItems = options.maxItems;
        this.uniqueItems = options.uniqueItems;
    }

    static fromJSON(
        name: string,
        json: JsonSchemaArray
    ): CallableFunctionArray {
        const callableFunctionArrayModel = jsonSchemaArraySchema.parse(json);
        const callableFunctionArray = new CallableFunctionArray(
            name,
            callableFunctionArrayModel
        );
        const { items, prefixItems, contains } = callableFunctionArrayModel;

        if (items) {
            if (typeof items === "boolean") {
                callableFunctionArray.items = items;
            } else {
                callableFunctionArray.items =
                    CallableFunctionParameterFactory.fromJSON(
                        `${name}.items`,
                        items
                    );
            }
        }

        if (prefixItems) {
            callableFunctionArray.prefixItems = [];
            for (const value of prefixItems) {
                callableFunctionArray.prefixItems.push(
                    CallableFunctionParameterFactory.fromJSON(
                        `${name}.prefixItems`,
                        value
                    )
                );
            }
        }

        if (contains) {
            callableFunctionArray.contains =
                CallableFunctionParameterFactory.fromJSON(
                    `${name}.contains`,
                    contains
                );
        }

        return callableFunctionArray;
    }

    /**
     * Whether the given `JsonSchema` is a `JsonSchemaArray`.
     *
     * Note: This method does not check if the schema is valid, only if it has properties unique to array schemas.
     */
    static isArraySchema(json: JsonSchema): json is JsonSchemaArray {
        return (json as JsonSchemaArray).type === "array";
    }

    toJSON(): JsonSchemaArray {
        const json: JsonSchemaArray = {
            ...this.toJSONBase(),
            type: this.type,
            minContains: this.minContains,
            maxContains: this.maxContains,
            minItems: this.minItems,
            maxItems: this.maxItems,
            uniqueItems: this.uniqueItems,
        };

        if (this.items) {
            if (typeof this.items === "boolean") {
                json.items = this.items;
            } else {
                json.items = this.items.toJSON() as JsonSchema;
            }
        }

        if (this.prefixItems) {
            json.prefixItems = [];
            for (const value of this.prefixItems) {
                json.prefixItems.push(value.toJSON() as JsonSchema);
            }
        }

        if (this.contains) {
            json.contains = this.contains.toJSON() as JsonSchema;
        }

        return jsonSchemaArraySchema.parse(json);
    }
}
