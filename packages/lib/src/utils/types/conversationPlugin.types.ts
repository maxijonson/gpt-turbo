import { ChatCompletionService } from "../../classes/ChatCompletionService.js";
import { Conversation } from "../../classes/Conversation.js";
import { ConversationCallableFunctions } from "../../classes/ConversationCallableFunctions.js";
import { ConversationConfig } from "../../classes/ConversationConfig.js";
import { ConversationHistory } from "../../classes/ConversationHistory.js";
import { ConversationPluginService } from "../../classes/ConversationPluginService.js";
import { ConversationRequestOptions } from "../../classes/ConversationRequestOptions.js";
import { Message } from "../../classes/Message.js";
import { ConversationModel } from "../../schemas/conversation.schema.js";
import { ConversationCallableFunctionsModel } from "../../schemas/conversationCallableFunctions.schema.js";
import { ConversationConfigModel } from "../../schemas/conversationConfig.schema.js";
import { ConversationHistoryModel } from "../../schemas/conversationHistory.schema.js";
import { ConversationRequestOptionsModel } from "../../schemas/conversationRequestOptions.schema.js";

/**
 * Conversation plugins are used to extend the functionality of a conversation. They receive a reference to the conversation and its properties and return a `ConversationPluginDefinition` object.
 */
export interface ConversationPlugin<TName extends string = string, TOut = any> {
    (
        /**
         * The properties of the conversation this plugin has access to.
         *
         * Internally, these are read-only, so you are guaranteed they will not change (reference) while your plugin is running.
         */
        properties: ConversationPluginProperties,

        /**
         * The plugin data previously stored by this plugin with the `getPluginData` method.
         */
        pluginData?: unknown
    ): ConversationPluginDefinition<TName, TOut>;
}

/**
 * The properties of the conversation a plugin has access to.
 */
export interface ConversationPluginProperties {
    /**
     * The conversation the plugin is attached to.
     */
    conversation: Conversation;

    /**
     * The configuration of the conversation.
     */
    config: ConversationConfig;

    /**
     * The request options of the conversation.
     */
    requestOptions: ConversationRequestOptions;

    /**
     * The history of the conversation.
     */
    history: ConversationHistory;

    /**
     * The callable functions of the conversation.
     */
    callableFunctions: ConversationCallableFunctions;

    /**
     * The chat completion service of the conversation.
     */
    chatCompletionService: ChatCompletionService;

    /**
     * The plugin service of the conversation.
     */
    pluginService: ConversationPluginService;
}

/**
 * The base definition of a conversation plugin without output.
 */
export interface ConversationPluginDefinitionBase<
    TName extends string = string
> {
    /**
     * A **unique** name for this plugin. You should set this to your plugin's package name to avoid name collisions.
     */
    name: TName;

    /**
     * Called after all plugins have been initialized.
     *
     * @remarks
     * This could potentially be used to interop with other plugins.
     */
    onPostInit?: () => void;

    /**
     * Transform the `ConversationModel` returned by the `Conversation.toJSON` method.
     *
     * Must return a valid `ConversationModel`.
     * Model is validated using the `conversationSchema` **at the end** of all transformations.
     *
     * @remarks
     * You should **not** modify the `pluginsData` property of the `ConversationModel` in this method.
     * Use the `getPluginData` method instead to prevent conflicts with other plugins.
     *
     * @param json The current `ConversationModel` that was generated by the library (or previous plugins)
     * @returns The new state of the `ConversationModel` to be returned by the `Conversation.toJSON` method.
     */
    transformConversationJson?: (json: ConversationModel) => ConversationModel;

    /**
     * Transform the `ConversationCallableFunctionsModel` returned by the `ConversationCallableFunctions.toJSON` method.
     * Note that this is the model of the `ConversationCallableFunctions` class, not the `CallableFunction` class.
     *
     * Must return a valid `ConversationCallableFunctionsModel`.
     * Model is validated using the `conversationCallableFunctionsSchema` **at the end** of all transformations.
     *
     * @param json The current `ConversationCallableFunctionsModel` that was generated by the library (or previous plugins)
     * @returns The new state of the `ConversationCallableFunctionsModel` to be returned by the `ConversationCallableFunctions.toJSON` method.
     */
    transformConversationCallableFunctionsJson?: (
        json: ConversationCallableFunctionsModel
    ) => ConversationCallableFunctionsModel;

    /**
     * Transform the `ConversationConfigModel` returned by the `ConversationConfig.toJSON` method.
     *
     * Must return a valid `ConversationConfigModel`.
     * Model is validated using the `conversationConfigSchema` **at the end** of all transformations.
     *
     * @param json The current `ConversationConfigModel` that was generated by the library (or previous plugins)
     * @returns The new state of the `ConversationConfigModel` to be returned by the `ConversationConfig.toJSON` method.
     */
    transformConversationConfigJson?: (
        json: ConversationConfigModel
    ) => ConversationConfigModel;

    /**
     * Transform the `ConversationHistoryModel` returned by the `ConversationHistory.toJSON` method.
     *
     * Must return a valid `ConversationHistoryModel`.
     * Model is validated using the `conversationHistorySchema` **at the end** of all transformations.
     *
     * @param json The current `ConversationHistoryModel` that was generated by the library (or previous plugins)
     * @returns The new state of the `ConversationHistoryModel` to be returned by the `ConversationHistory.toJSON` method.
     */
    transformConversationHistoryJson?: (
        json: ConversationHistoryModel
    ) => ConversationHistoryModel;

    /**
     * Transform the `ConversationRequestOptionsModel` returned by the `ConversationRequestOptions.toJSON` method.
     *
     * Must return a valid `ConversationRequestOptionsModel`.
     * Model is validated using the `conversationRequestOptionsSchema` **at the end** of all transformations.
     *
     * @param json The current `ConversationRequestOptionsModel` that was generated by the library (or previous plugins)
     * @returns The new state of the `ConversationRequestOptionsModel` to be returned by the `ConversationRequestOptions.toJSON` method.
     */
    transformConversationRequestOptionsJson?: (
        json: ConversationRequestOptionsModel
    ) => ConversationRequestOptionsModel;

    /**
     * Tap into a user message instance created during prompt.
     *
     * @param message The user message instance
     */
    onUserPrompt?: (message: Message) => void | Promise<void>;

    /**
     * Called when an error is thrown during a user prompt.
     * This can be useful to clean up your plugin's state.
     *
     * @remarks
     * Errors thrown during this method will have no effect.
     * This is to ensure all plugins implementing this method are called.
     *
     * @param error The error that was thrown during a user prompt
     */
    onUserPromptError?: (error: unknown) => void | Promise<void>;

    /**
     * Tap into an assistant message instance during a chat completion.
     *
     * @remarks
     * Keep in mind that the message passed to this method is not necessarily a standard chat completion. It could be a function call too.
     * Additionnaly, the message could be streamed or not, so message content may not yet be available when this method is called.
     *
     * @param message The assistant message instance
     */
    onChatCompletion?: (message: Message) => void | Promise<void>;

    /**
     * Transform the function prompt result before it is stringified.
     *
     * @param result The result of the function generated by the client code
     * @returns The new result. Keep in mind this result is later stringified (using `JSON.stringify`). Your result must be serializable.
     */
    transformFunctionResult?: (result: any) => any | Promise<any>;

    /**
     * Tap into a function message instance.
     *
     * @param prompt The stringified result of what was passed to the `Conversation.functionPrompt` method, after it was transformed by `transformFunctionResult`.
     */
    onFunctionPrompt?: (prompt: Message) => void | Promise<void>;

    /**
     * Called when an error is thrown during a function prompt.
     * This can be useful to clean up your plugin's state.
     *
     * @remarks
     * Errors thrown during this method will have no effect.
     * This is to ensure all plugins implementing this method are called.
     *
     * @param error The error that was thrown during a function prompt
     */
    onFunctionPromptError?: (error: unknown) => void | Promise<void>;

    /**
     * Allows your plugin to store data in the `pluginsData` property of the `ConversationModel` returned by the `Conversation.toJSON` method.
     * This data will be stored under the name of your plugin and will be accessible when your plugin is initialized. (second argument of the plugin function)
     *
     * @remarks
     * This data should be serializable.
     *
     * @returns The data to be stored in the `pluginsData` property of the `ConversationModel` returned by the `Conversation.toJSON` method.
     */
    getPluginData?: () => any | Promise<any>;
}

export type ConversationPluginDefinition<
    TName extends string = string,
    TOut = undefined
> = ConversationPluginDefinitionBase<TName> &
    (TOut extends undefined
        ? {
              /**
               * The output of the plugin
               * This is useful for plugins that want to expose some functionality to client code.
               * This output can be virtually anything, such as a class instance, a function, or a primitive value.
               *
               * @example
               * Typically, client code would access the output of a plugin like this:
               *
               * ```ts
               * const myPlugin = conversation.getPlugin("myPlugin");
               * const myPluginOutput = myPlugin.out;
               * ```
               */
              out?: undefined;
          }
        : {
              /**
               * The output of the plugin
               * This is useful for plugins that want to expose some functionality to client code.
               * This output can be virtually anything, such as a class instance, a function, or a primitive value.
               *
               * @example
               * Typically, client code would access the output of a plugin like this:
               *
               * ```ts
               * const myPlugin = conversation.getPlugin("myPlugin");
               * const myPluginOutput = myPlugin.out;
               * ```
               */
              out: TOut;
          });
