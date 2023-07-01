import { JsonSchemaObject } from "gpt-turbo";

export default (
    schema?: JsonSchemaObject
): { name: string; type: string; required: boolean }[] => {
    if (!schema) return [];
    return Object.entries(schema?.properties ?? {}).map(
        ([name, jsonSchema]: [string, any]) => {
            const type = (() => {
                if (jsonSchema.type) return jsonSchema.type as string;
                if (jsonSchema.enum) return "enum";
                if (jsonSchema.const) return "const";
                return "unknown";
            })();
            const required = (schema?.required ?? []).includes(name);
            return { name, required, type };
        }
    );
};
