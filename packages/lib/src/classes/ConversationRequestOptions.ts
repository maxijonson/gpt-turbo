import {
    ConversationRequestOptionsModel,
    conversationRequestOptionsSchema,
} from "../schemas/conversationRequestOptions.schema.js";
import { PluginService } from "./PluginService.js";

/**
 * Holds the callable functions of a `Conversation`.
 *
 * @internal
 * This class is used internally by the library and is not meant to be **instantiated** by consumers of the library.
 */
export class ConversationRequestOptions {
    headers: ConversationRequestOptionsModel["headers"];
    proxy: ConversationRequestOptionsModel["proxy"];

    constructor(
        private readonly pluginService: PluginService,
        options: ConversationRequestOptionsModel = {}
    ) {
        this.setRequestOptions(options);
    }

    /**
     * Serializes the `ConversationRequestOptions` to JSON.
     *
     * @returns A JSON representation of the `ConversationRequestOptions` instance.
     */
    public toJSON(): ConversationRequestOptionsModel {
        const json: ConversationRequestOptionsModel = {
            headers: this.headers,
            proxy: this.proxy,
        };
        return conversationRequestOptionsSchema.parse(json);
    }

    /**
     * Sets new request options to be used as defaults for all HTTP requests made by this conversation.
     *
     * @param requestOptions The new request options to use.
     * @param merge Set to `true` to shallow merge the new request options with the existing request options instead of replacing them.
     */
    public setRequestOptions(
        requestOptions: ConversationRequestOptionsModel,
        merge = false
    ) {
        const options = merge
            ? { ...this.headers, ...this.proxy, ...requestOptions }
            : requestOptions;
        this.headers = options.headers;
        this.proxy = options.proxy;
    }
}
