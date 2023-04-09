import { RequestOptionsProxy } from "./types.js";

/**
 * Returns the URL object for a request, taking into account a proxy.
 */
export default (targetUrl: string, proxy?: RequestOptionsProxy) => {
    let url = new URL(targetUrl);
    if (proxy) {
        url = new URL(
            url.pathname,
            `${proxy.protocol || "http"}://${proxy.host}:${proxy.port || 80}`
        );
    }

    return url;
};
