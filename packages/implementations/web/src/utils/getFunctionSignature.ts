import { JsonSchemaObject } from "gpt-turbo";
import getFunctionParameters from "./getFunctionParameters";

export default (name?: string, schema?: JsonSchemaObject) => {
    const parameters = getFunctionParameters(schema)
        .sort((a, b) => {
            if (a.required && !b.required) return -1;
            if (!a.required && b.required) return 1;
            return 0;
        })
        .map(
            ({ name, type, required }) =>
                `${name}${required ? "" : "?"}: ${type}`
        );

    return `${name ?? ""}(${parameters.join(", ")})`;
};
