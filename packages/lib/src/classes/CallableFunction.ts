import { JsonSchemaObject } from "index.js";
import {
    CallableFunctionModel,
    callableFunctionSchema,
} from "../schemas/callableFunction.schema.js";
import { v4 as uuid } from "uuid";

export class CallableFunction {
    /**
     * A UUID generated for this function by the library.
     */
    public id = uuid();

    public description?: string;
    private _parameters?: JsonSchemaObject;

    constructor(public name: string) {}

    /**
     * Creates a new `CallableFunction` instance from a serialized callable function.
     *
     * @param json The JSON object of the CallableFunction instance.
     * @returns A new `CallableFunction` instance
     */
    public static fromJSON(json: CallableFunctionModel): CallableFunction {
        const callableFunctionModel = callableFunctionSchema.parse(json);
        const callableFunction = new CallableFunction(
            callableFunctionModel.name
        );

        if (callableFunctionModel.id)
            callableFunction.id = callableFunctionModel.id;

        callableFunction.description = callableFunctionModel.description;
        callableFunction._parameters = callableFunctionModel.parameters;

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
            parameters: this._parameters,
        };
        return callableFunctionSchema.parse(json);
    }

    /**
     * Whether the callable function has a description.
     */
    public hasDescription(): this is CallableFunction & {
        description: string;
    } {
        return this.description !== undefined;
    }

    /**
     * Whether the callable function has parameters.
     */
    public hasParameters(): this is CallableFunction & {
        parameters: JsonSchemaObject;
    } {
        return this._parameters !== undefined;
    }

    get parameters() {
        return this._parameters;
    }
}
