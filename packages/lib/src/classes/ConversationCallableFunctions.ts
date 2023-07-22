import { CallableFunctionModel } from "../schemas/callableFunction.schema.js";
import {
    ConversationCallableFunctionsModel,
    conversationCallableFunctionsSchema,
} from "../schemas/conversationCallableFunctions.schema.js";
import { CallableFunction } from "./CallableFunction.js";

/**
 * Holds the callable functions of a `Conversation`.
 *
 * @internal
 * This class is used internally by the library and is not meant to be **instantiated** by consumers of the library.
 */
export class ConversationCallableFunctions {
    private functions: CallableFunction[];

    public constructor(options: ConversationCallableFunctionsModel = {}) {
        const { functions = [] } = options;
        this.functions = functions.map((fn) => CallableFunction.fromJSON(fn));
    }

    /**
     * Serializes the `ConversationCallableFunctions` to JSON.
     *
     * @returns A JSON representation of the `ConversationCallableFunctions` instance.
     *
     * @internal
     * This method is used internally by the library and is not meant to be used by consumers of the library.
     */
    public toJSON(): ConversationCallableFunctionsModel {
        const json: ConversationCallableFunctionsModel = {
            functions:
                this.functions.length === 0
                    ? undefined
                    : this.functions.map((fn) => fn.toJSON()),
        };
        return conversationCallableFunctionsSchema.parse(json);
    }

    /**
     * Removes a callable function from the conversation.
     *
     * @param idOrFn Either the ID of the function, the function itself, or the function model.
     */
    public removeFunction(
        idOrFn: string | CallableFunction | CallableFunctionModel
    ) {
        const id = typeof idOrFn === "string" ? idOrFn : idOrFn.id;
        const removedFn = this.functions.find((fn) => fn.id === id);
        if (!removedFn) return;
        this.functions = this.functions.filter((fn) => fn.id !== id);
    }

    /**
     * Removes all functions from the conversation.
     */
    public clearFunctions() {
        this.functions = [];
    }

    /**
     * Adds a function to the conversation. This function can be "called" by the assistant, generating a function call message.
     *
     * @param fn The function to add to the conversation.
     */
    public addFunction(fn: CallableFunction | CallableFunctionModel) {
        this.functions = this.functions
            .filter((f) => f.name !== fn.name && f.id !== fn.id)
            .concat(
                fn instanceof CallableFunction
                    ? fn
                    : CallableFunction.fromJSON(fn)
            );
    }

    /**
     * Get the functions in the conversation.
     *
     * @returns A **shallow copy** of the functions array.
     */
    public getFunctions() {
        return this.functions.slice(0);
    }

    /**
     * Gets the functions in a format the OpenAI Chat Completion API can understand.
     */
    public getCreateChatCompletionFunctions() {
        if (this.functions.length === 0) return undefined;
        return this.functions.map((fn) => fn.chatCompletionFunction);
    }
}
