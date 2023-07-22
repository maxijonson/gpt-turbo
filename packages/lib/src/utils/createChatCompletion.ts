import { ConversationRequestOptionsModel } from "schemas/conversationRequestOptions.schema.js";
import { ENDPOINT_CHATCOMPLETION } from "../index.js";
import getRequestHeaders from "./getRequestHeaders.js";
import getRequestUrl from "./getRequestUrl.js";
import {
    CreateChatCompletionRequest,
    CreateChatCompletionResponse,
} from "./types.js";

/**
 * Sends a Create Chat Completion request to the OpenAI API.
 *
 * @param chatCompletionRequestParams The Create Chat Completion parameters.
 * @param options Options to pass for the HTTP request.
 * @returns The response from the OpenAI API. A `ReadableStream` if `chatCompletionRequestParams.stream` is set to `true` in the request, otherwise a JSON object.
 */
export default async <T extends CreateChatCompletionRequest>(
    { apiKey, ...chatCompletionRequest }: T,
    { headers: optHeaders = {}, proxy }: ConversationRequestOptionsModel = {}
): Promise<
    T["stream"] extends true ? ReadableStream : CreateChatCompletionResponse
> => {
    const headers = getRequestHeaders(apiKey, optHeaders, proxy);
    const url = getRequestUrl(ENDPOINT_CHATCOMPLETION, proxy);

    const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(chatCompletionRequest),
    });

    if (!response.ok) {
        throw new Error(
            `Request failed: ${response.status} (${response.statusText})`
        );
    }

    return chatCompletionRequest.stream ? response.body : response.json();
};
