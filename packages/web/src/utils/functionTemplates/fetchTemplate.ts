import {
    CallableFunction,
    CallableFunctionEnum,
    CallableFunctionNumber,
} from "gpt-turbo";
import type { FunctionTemplate } from ".";

const fetchTemplate = new CallableFunction(
    "fetch",
    "Calls the JSON Placeholder API"
);
fetchTemplate
    .addParameter(
        new CallableFunctionEnum(
            "entityType",
            ["comments", "photos", "albums", "todos", "posts"],
            {
                description: "The type of entity to fetch.",
            }
        ),
        true
    )
    .addParameter(
        new CallableFunctionNumber("id", {
            description: "The ID of the entity to fetch.",
            minimum: 1,
            maximum: 100,
        })
    );

export default {
    ...fetchTemplate.toJSON(),
    template: "fetch",
    displayName: "Fetch",
    code: 'return (async ()=>{\n    const baseUrl = "https://jsonplaceholder.typicode.com";\n    const url = id ? `${baseUrl}/${entityType}/${id}` : `${baseUrl}/${entityType}`;\n    const response = await fetch(url);\n    const json = await response.json();\n    return id ? json : json.slice(0, 5);\n})();',
} satisfies FunctionTemplate;
