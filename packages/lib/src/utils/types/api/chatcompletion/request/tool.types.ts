import { JsonSchemaObject } from "../../../../../schemas/jsonSchema.schema.js";

export interface ChatCompletionRequestFunctionTool {
    /**
     * The type of the tool.
     */
    type: "function";

    /**
     * The function definition.
     */
    function: {
        /**
         * The name of the function to be called. Must be a-z, A-Z, 0-9, or contain underscores and dashes, with a maximum length of 64.
         */
        name: string;

        /**
         * A description of what the function does, used by the model to choose when and how to call the function.
         */
        description?: string;

        /**
         * The parameters the functions accepts, described as a JSON Schema object.
         */
        parameters?: JsonSchemaObject;
    };
}

export interface ChatCompletionRequestOtherTool {
    type: string;
    [key: string]: any;
}

export type ChatCompletionRequestTool =
    | ChatCompletionRequestFunctionTool
    | ChatCompletionRequestOtherTool;

export type ChatCompletionRequestNamedFunctionToolChoice = {
    type: "function";
    function: { name: string };
};

export interface ChatCompletionRequestNamedOtherToolChoice {
    type: string;
    [key: string]: any;
}

export type ChatCompletionRequestNamedToolChoice =
    | ChatCompletionRequestNamedFunctionToolChoice
    | ChatCompletionRequestNamedOtherToolChoice;

export type ChatCompletionRequestToolChoice =
    | "auto"
    | "none"
    | ChatCompletionRequestNamedToolChoice;
