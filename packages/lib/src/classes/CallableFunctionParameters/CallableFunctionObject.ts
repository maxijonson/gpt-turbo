import {
    JsonSchema,
    JsonSchemaObject,
    jsonSchemaObjectSchema,
} from "../../schemas/jsonSchema.schema.js";
import { CallableFunctionParameter } from "./CallableFunctionParameter.js";
import { CallableFunctionParameterFactory } from "./CallableFunctionParameterFactory.js";

export class CallableFunctionObject extends CallableFunctionParameter<JsonSchemaObject> {
    readonly type = "object";

    unevaluatedProperties?: JsonSchemaObject["unevaluatedProperties"];
    minProperties?: JsonSchemaObject["minProperties"];
    maxProperties?: JsonSchemaObject["maxProperties"];
    patternProperties?: Record<string, CallableFunctionParameter>;
    additionalProperties?: boolean | CallableFunctionParameter;

    private _required: Exclude<JsonSchemaObject["required"], undefined> = [];
    private _properties: Record<string, CallableFunctionParameter> = {};

    constructor(
        name: string,
        options: Omit<
            JsonSchemaObject,
            | "type"
            | "properties"
            | "patternProperties"
            | "additionalProperties"
            | "required"
        > = {}
    ) {
        super(name, options);
        this.unevaluatedProperties = options.unevaluatedProperties;
        this.minProperties = options.minProperties;
        this.maxProperties = options.maxProperties;
    }

    static fromJSON(
        name: string,
        json: JsonSchemaObject
    ): CallableFunctionObject {
        const callableFunctionObjectModel = jsonSchemaObjectSchema.parse(json);
        const callableFunctionObject = new CallableFunctionObject(
            name,
            callableFunctionObjectModel
        );
        const { properties, patternProperties, additionalProperties } =
            callableFunctionObjectModel;

        if (properties) {
            for (const [name, value] of Object.entries(properties)) {
                callableFunctionObject.addProperty(
                    CallableFunctionParameterFactory.fromJSON(name, value)
                );
            }
        }

        if (patternProperties) {
            callableFunctionObject.patternProperties = {};
            for (const [pattern, value] of Object.entries(patternProperties)) {
                callableFunctionObject.patternProperties[pattern] =
                    CallableFunctionParameterFactory.fromJSON(pattern, value);
            }
        }

        if (additionalProperties !== undefined) {
            if (typeof additionalProperties === "boolean") {
                callableFunctionObject.additionalProperties =
                    additionalProperties;
            } else {
                callableFunctionObject.additionalProperties =
                    CallableFunctionParameterFactory.fromJSON(
                        // Technically, additionalProperties does not need a name, because it's used to validate properties that are not defined in the schema.
                        `${name}.additionalProperties`,
                        additionalProperties
                    );
            }
        }

        return callableFunctionObject;
    }

    /**
     * Whether the given `JsonSchema` is a `JsonSchemaObject`.
     *
     * Note: This method does not check if the schema is valid, only if it has properties unique to object schemas.
     */
    static isObjectSchema(json: JsonSchema): json is JsonSchemaObject {
        return (json as JsonSchemaObject).type === "object";
    }

    toJSON(): JsonSchemaObject {
        const json: JsonSchemaObject = {
            ...this.toJSONBase(),
            type: this.type,
            unevaluatedProperties: this.unevaluatedProperties,
            minProperties: this.minProperties,
            maxProperties: this.maxProperties,
        };

        if (this.patternProperties) {
            json.patternProperties = {};
            for (const [pattern, value] of Object.entries(
                this.patternProperties
            )) {
                json.patternProperties[pattern] = value.toJSON() as JsonSchema;
            }
        }

        if (this.additionalProperties) {
            if (typeof this.additionalProperties === "boolean") {
                json.additionalProperties = this.additionalProperties;
            } else {
                json.additionalProperties =
                    this.additionalProperties.toJSON() as JsonSchema;
            }
        }

        if (this._required.length > 0) {
            json.required = this._required;
        }

        if (this._properties) {
            json.properties = {};
            for (const [name, value] of Object.entries(this._properties)) {
                json.properties[name] = value.toJSON() as JsonSchema;
            }
        }

        return jsonSchemaObjectSchema.parse(json);
    }

    /**
     * Adds a property to the object.
     *
     * @param propertyOrSchema The property to add or the JsonSchema of the property and its name to add.
     * @param required Whether the property is required.
     * @returns this
     */
    addProperty(
        propertyOrSchema:
            | CallableFunctionParameter
            | (JsonSchema & { name: string }),
        required = false
    ): CallableFunctionObject {
        const property =
            propertyOrSchema instanceof CallableFunctionParameter
                ? propertyOrSchema
                : CallableFunctionParameterFactory.fromJSON(
                      propertyOrSchema.name,
                      propertyOrSchema
                  );

        if (!this._properties) this._properties = {};
        this._properties[property.name] = property;

        if (!required && this._required.includes(property.name)) {
            this._required = this._required.filter(
                (name) => name !== property.name
            );
        } else if (required) {
            this._required.push(property.name);
        }

        return this;
    }

    /**
     * Gets a property by name.
     *
     * @param name The name of the property to get.
     * @returns The property with the given name, or undefined if it does not exist.
     */
    getProperty(name: string): CallableFunctionParameter | undefined {
        return this._properties[name];
    }

    /**
     * Removes a property by name.
     *
     * @param name The name of the property to remove.
     * @returns this
     */
    removeProperty(name: string): CallableFunctionObject {
        delete this._properties[name];
        return this;
    }

    /**
     * @returns All properties of the object.
     */
    getProperties() {
        return Object.values(this._properties);
    }

    /**
     * @returns All required properties of the object.
     */
    getRequiredProperties() {
        return this._required
            .map((name) => this.getProperty(name))
            .filter(
                (property): property is CallableFunctionParameter => !!property
            );
    }

    /**
     * @returns All optional properties of the object.
     */
    getOptionalProperties() {
        return this.getProperties().filter(
            (property) => !this._required.includes(property.name)
        );
    }

    /**
     * The number of properties in the object.
     */
    get length() {
        return Object.keys(this._properties).length;
    }
}
