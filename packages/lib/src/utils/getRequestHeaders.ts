import base64Encode from "./base64Encode.js";
import { RequestOptionsProxy } from "./types.js";

/**
 * Returns the headers object for a request.
 */
export default (
    apiKey: string,
    optHeaders: Record<string, string> = {},
    proxy?: RequestOptionsProxy
) => {
    const headers: Record<string, string> = {
        ...optHeaders,
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
    };

    if (proxy && proxy.auth) {
        const auth = base64Encode(
            `${proxy.auth.username}:${proxy.auth.password}`
        );
        headers["Proxy-Authorization"] = `Basic ${auth}`;
    }

    return headers;
};
