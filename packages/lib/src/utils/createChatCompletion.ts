import { ENDPOINT_CHATCOMPLETION } from "../index.js";
import {
    CreateChatCompletionRequest,
    RequestOptions,
    CreateChatCompletionResponse,
} from "./types.js";

export default async <T extends CreateChatCompletionRequest>(
    { apiKey, ...chatCompletionRequest }: T,
    { headers: optHeaders = {}, proxy }: RequestOptions = {}
): Promise<
    T["stream"] extends true ? ReadableStream : CreateChatCompletionResponse
> => {
    let url = new URL(ENDPOINT_CHATCOMPLETION);
    const headers: Record<string, string> = {
        ...optHeaders,
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
    };

    if (proxy) {
        url = new URL(
            url.pathname,
            `${proxy.protocol || "http"}://${proxy.host}:${proxy.port || 80}`
        );
        if (proxy.auth) {
            const auth = Buffer.from(
                `${proxy.auth.username}:${proxy.auth.password}`
            ).toString("base64");
            headers["Proxy-Authorization"] = `Basic ${auth}`;
        }
    }

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
