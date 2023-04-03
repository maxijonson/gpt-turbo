import { ENDPOINT_MODERATION } from "../index.js";
import base64Encode from "./base64Encode.js";
import {
    CreateModerationRequest,
    CreateModerationResponse,
    RequestOptions,
} from "./types.js";

export default async (
    { apiKey, input }: CreateModerationRequest,
    { headers: optHeaders = {}, proxy }: RequestOptions
): Promise<CreateModerationResponse> => {
    let url = new URL(ENDPOINT_MODERATION);
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
            const auth = base64Encode(
                `${proxy.auth.username}:${proxy.auth.password}`
            );
            headers["Proxy-Authorization"] = `Basic ${auth}`;
        }
    }

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
