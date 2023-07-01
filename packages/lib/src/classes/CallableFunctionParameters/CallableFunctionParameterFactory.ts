import { JsonSchema } from "../../index.js";
import { CallableFunctionParameter } from "./CallableFunctionParameter.js";
import { CallableFunctionArray } from "./CallableFunctionArray.js";
import { CallableFunctionBoolean } from "./CallableFunctionBoolean.js";
import { CallableFunctionConst } from "./CallableFunctionConst.js";
import { CallableFunctionEnum } from "./CallableFunctionEnum.js";
import { CallableFunctionNull } from "./CallableFunctionNull.js";
import { CallableFunctionNumber } from "./CallableFunctionNumber.js";
import { CallableFunctionObject } from "./CallableFunctionObject.js";
import { CallableFunctionString } from "./CallableFunctionString.js";

export class CallableFunctionParameterFactory {
    /**
     * Creates a new concrete subclass of `CallableFunctionParameter` based on a serialized parameter.
     *
     * @remarks You may use the concrete subclass' `fromJSON` static method instead of this one, if you know the type of the parameter.
     * @param name The name of the parameter, usually a JavaScript identifier.
     * @param json The JSON object of a `CallableFunctionParameter` subclass instance.
     * @returns A concrete subclass of `CallableFunctionParameter` based on the JSON object.
     */
    static fromJSON(name: string, json: JsonSchema): CallableFunctionParameter {
        if (CallableFunctionString.isStringSchema(json)) {
            return CallableFunctionString.fromJSON(name, json);
        }
        if (CallableFunctionNumber.isNumberSchema(json)) {
            return CallableFunctionNumber.fromJSON(name, json);
        }
        if (CallableFunctionBoolean.isBooleanSchema(json)) {
            return CallableFunctionBoolean.fromJSON(name, json);
        }
        if (CallableFunctionNull.isNullSchema(json)) {
            return CallableFunctionNull.fromJSON(name, json);
        }
        if (CallableFunctionEnum.isEnumSchema(json)) {
            return CallableFunctionEnum.fromJSON(name, json);
        }
        if (CallableFunctionConst.isConstSchema(json)) {
            return CallableFunctionConst.fromJSON(name, json);
        }
        if (CallableFunctionObject.isObjectSchema(json)) {
            return CallableFunctionObject.fromJSON(name, json);
        }
        if (CallableFunctionArray.isArraySchema(json)) {
            return CallableFunctionArray.fromJSON(name, json);
        }
        throw new Error(
            `Unknown parameter type:\n${JSON.stringify(json, null, 4)}`
        );
    }
}
