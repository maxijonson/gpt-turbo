export default (payload: string) => {
    if (typeof window !== "undefined" && typeof window.btoa === "function") {
        return window.btoa(payload);
    }
    if (typeof Buffer !== "undefined") {
        return Buffer.from(payload).toString("base64");
    }
    throw new Error("Base64 encoding not supported");
};
