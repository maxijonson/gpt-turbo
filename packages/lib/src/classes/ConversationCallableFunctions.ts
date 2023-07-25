import { CallableFunctionModel } from "../schemas/callableFunction.schema.js";
import {
    ConversationCallableFunctionsModel,
    conversationCallableFunctionsSchema,
} from "../schemas/conversationCallableFunctions.schema.js";
import {
    AddCallableFunctionListener,
    RemoveCallableFunctionListener,
} from "../utils/types/index.js";
import { CallableFunction } from "./CallableFunction.js";
import { ConversationPluginService } from "./ConversationPluginService.js";
import { EventManager } from "./EventManager.js";

/**
 * Holds the callable functions of a `Conversation`.
 *
 * @internal
 * This class is used internally by the library and is not meant to be **instantiated** by consumers of the library.
 */
export class ConversationCallableFunctions {
    private functions: CallableFunction[];
    private addCallableFunctionEvents =
        new EventManager<AddCallableFunctionListener>();
    private removeCallableFunctionEvents =
        new EventManager<RemoveCallableFunctionListener>();

    public constructor(
        private readonly pluginService: ConversationPluginService,
        options: ConversationCallableFunctionsModel = {}
    ) {
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
        return conversationCallableFunctionsSchema.parse(
            this.pluginService.transformConversationCallableFunctionsJson(json)
        );
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
        this.removeCallableFunctionEvents.emit(removedFn);
    }

    /**
     * Removes all functions from the conversation.
     */
    public clearFunctions() {
        this.functions.forEach((fn) => this.removeFunction(fn));
    }

    /**
     * Adds a function to the conversation. This function can be "called" by the assistant, generating a function call message.
     *
     * @param fn The function to add to the conversation.
     */
    public addFunction(fn: CallableFunction | CallableFunctionModel) {
        const callableFunction =
            fn instanceof CallableFunction ? fn : CallableFunction.fromJSON(fn);
        this.functions = this.functions
            .filter(
                (f) =>
                    f.name !== callableFunction.name &&
                    f.id !== callableFunction.id
            )
            .concat(callableFunction);
        this.addCallableFunctionEvents.emit(callableFunction);
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

    /**
     * Adds a listener function that is called whenever a callableFunction is added to the conversation.
     *
     * @param listener The function to call when a callableFunction is added to the conversation.
     * @returns A function that removes the listener from the list of listeners.
     */
    public onCallableFunctionAdded(listener: AddCallableFunctionListener) {
        return this.addCallableFunctionEvents.addListener(listener);
    }

    /**
     * Adds a listener function that is called only once whenever a callableFunction is added to the conversation.
     *
     * @param listener The function to call when a callableFunction is added to the conversation.
     * @returns A function that removes the listener from the list of listeners.
     */
    public onceCallableFunctionAdded(listener: AddCallableFunctionListener) {
        return this.addCallableFunctionEvents.once(listener);
    }

    /**
     * Removes a listener function from the list of listeners that was previously added with `onCallableFunctionAdded`.
     *
     * @param listener The function to remove from the list of listeners.
     */
    public offCallableFunctionAdded(listener: AddCallableFunctionListener) {
        return this.addCallableFunctionEvents.removeListener(listener);
    }

    /**
     * Adds a listener function that is called whenever a callableFunction is removed to the conversation.
     *
     * @param listener The function to call when a callableFunction is removed to the conversation.
     * @returns A function that removes the listener from the list of listeners.
     */
    public onCallableFunctionRemoved(listener: RemoveCallableFunctionListener) {
        return this.removeCallableFunctionEvents.addListener(listener);
    }

    /**
     * Adds a listener function that is called only once whenever a callableFunction is removed to the conversation.
     *
     * @param listener The function to call when a callableFunction is removed to the conversation.
     * @returns A function that removes the listener from the list of listeners.
     */
    public onceCallableFunctionRemoved(
        listener: RemoveCallableFunctionListener
    ) {
        return this.removeCallableFunctionEvents.once(listener);
    }

    /**
     * Removes a listener function from the list of listeners that was previously added with `onCallableFunctionRemoved`.
     *
     * @param listener The function to remove from the list of listeners.
     */
    public offCallableFunctionRemoved(
        listener: RemoveCallableFunctionListener
    ) {
        return this.removeCallableFunctionEvents.removeListener(listener);
    }
}
