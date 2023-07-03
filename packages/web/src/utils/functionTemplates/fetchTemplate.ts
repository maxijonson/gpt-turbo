import {
    CallableFunction,
    CallableFunctionEnum,
    CallableFunctionNumber,
} from "gpt-turbo";
import type { FunctionTemplate } from ".";
import getFunctionBody from "../getFunctionBody";

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
    code: getFunctionBody((entityType: string, id?: number) => {
        return (async () => {
            const baseUrl = "https://jsonplaceholder.typicode.com";
            const url = id
                ? `${baseUrl}/${entityType}/${id}`
                : `${baseUrl}/${entityType}`;

            const response = await fetch(url);
            const json = await response.json();
            return id ? json : json.slice(0, 5);
        })();
    }),
} satisfies FunctionTemplate;
