import { RequestOptionsProxy } from "./types.js";

/**
 * Returns the URL object for a request, taking into account a proxy.
 */
export default (targetUrl: string, proxy?: RequestOptionsProxy) => {
    if (!proxy) return new URL(targetUrl);

    const protocol = proxy.protocol || "http";
    const host = proxy.host;
    const port = proxy.port || (protocol === "https" ? 443 : 80);

    if (!host) {
        throw new Error("Proxy host is required.");
    }

    return new URL(`${protocol}://${host}:${port}/${targetUrl}`);
};
