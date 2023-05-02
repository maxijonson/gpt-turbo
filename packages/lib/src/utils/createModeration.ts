import { ENDPOINT_MODERATION } from "../index.js";
import getRequestHeaders from "./getRequestHeaders.js";
import getRequestUrl from "./getRequestUrl.js";
import {
    CreateModerationRequest,
    CreateModerationResponse,
    RequestOptions,
} from "./types.js";

/**
 * Sends a Create Moderation request to the OpenAI API.
 *
 * @param moderationRequestParams The Create Moderation parameters.
 * @param options Options to pass for the HTTP request.
 * @returns The CreateModerationResponse from the OpenAI API.
 */
export default async (
    { apiKey, input }: CreateModerationRequest,
    { headers: optHeaders = {}, proxy }: RequestOptions
): Promise<CreateModerationResponse> => {
    const headers = getRequestHeaders(apiKey, optHeaders, proxy);
    const url = getRequestUrl(ENDPOINT_MODERATION, proxy);

    const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify({ input }),
    });

    if (!response.ok) {
        throw new Error(
            `Request failed: ${response.status} (${response.statusText})`
        );
    }

    return response.json();
};
