import {
    CallableFunctionModel,
    callableFunctionSchema,
} from "../schemas/callableFunction.schema.js";
import { v4 as uuid } from "uuid";
import { CallableFunctionObject } from "./CallableFunctionParameters/CallableFunctionObject.js";
import { CreateChatCompletionFunction } from "../utils/types.js";
import { CallableFunctionParameter } from "./CallableFunctionParameters/CallableFunctionParameter.js";
import { JsonSchema, JsonSchemaObject } from "../index.js";

export class CallableFunction {
    /**
     * A UUID generated for this function by the library.
     */
    public id = uuid();

    private _parameters: CallableFunctionObject;

    constructor(
        /**
         * The name of the callable function. This name will be used by the AI assistant.
         */
        public name: string,
        /**
         * A description of the callable function. While optional, it is strongly recommended to provide a description.
         */
        public description?: string,
        /**
         * The initial parameters of the callable function.
         */
        parameters?: CallableFunctionObject | JsonSchemaObject
    ) {
        if (!parameters) {
            this._parameters = new CallableFunctionObject(
                `__CallableFunction__${name}__parameters__`
            );
        } else {
            this._parameters =
                parameters instanceof CallableFunctionObject
                    ? parameters
                    : CallableFunctionObject.fromJSON(
                          `__CallableFunction__${name}__parameters__`,
                          parameters
                      );
        }
    }

    /**
     * Creates a new `CallableFunction` instance from a serialized callable function.
     *
     * @param json The JSON object of the CallableFunction instance.
     * @returns A new `CallableFunction` instance
     */
    public static fromJSON(json: CallableFunctionModel): CallableFunction {
        const callableFunctionModel = callableFunctionSchema.parse(json);
        const callableFunction = new CallableFunction(
            callableFunctionModel.name,
            callableFunctionModel.description,
            callableFunctionModel.parameters
                ? CallableFunctionObject.fromJSON(
                      `__CallableFunction__${callableFunctionModel.name}__parameters__`,
                      callableFunctionModel.parameters
                  )
                : undefined
        );

        if (callableFunctionModel.id)
            callableFunction.id = callableFunctionModel.id;

        return callableFunction;
    }

    /**
     * Serializes the callable function to JSON.
     *
     * @returns The `CallableFunction` as a JSON object.
     */
    public toJSON(): CallableFunctionModel {
        const json: CallableFunctionModel = {
            id: this.id,
            name: this.name,
            description: this.description,
            parameters:
                this._parameters.length > 0
                    ? this._parameters.toJSON()
                    : undefined,
        };
        return callableFunctionSchema.parse(json);
    }

    /**
     * Adds a parameter to the object.
     *
     * @param parameterOrSchema The parameter to add or the JsonSchema of the parameter and its name to add.
     * @param required Whether the parameter is required.
     * @returns this
     */
    public addParameter(
        parameterOrSchema:
            | CallableFunctionParameter
            | (JsonSchema & { name: string }),
        required = false
    ) {
        this._parameters.addProperty(parameterOrSchema, required);
        return this;
    }

    /**
     * Gets a parameter by name.
     *
     * @param name The name of the parameter to get.
     * @returns The parameter with the given name, or undefined if it does not exist.
     */
    public getParameter(name: string) {
        return this._parameters.getProperty(name);
    }

    /**
     * Removes a parameter by name.
     *
     * @param name The name of the parameter to remove.
     * @returns this
     */
    public removeParameter(name: string) {
        this._parameters.removeProperty(name);
        return this;
    }

    /**
     * The list of `CallableFunctionParameter` instances.
     */
    get parameters() {
        return this._parameters.getProperties();
    }

    /**
     * The list of required `CallableFunctionParameter` instances.
     */
    get requiredParameters() {
        return this._parameters.getRequiredProperties();
    }

    /**
     * The list of optional `CallableFunctionParameter` instances.
     */
    get optionalParameters() {
        return this._parameters.getOptionalProperties();
    }

    /**
     * JSON definition of the callable function as consumed by OpenAI's API.
     */
    get chatCompletionFunction(): CreateChatCompletionFunction {
        return {
            name: this.name,
            description: this.description,
            parameters: this._parameters.toJSON(),
        };
    }
}
