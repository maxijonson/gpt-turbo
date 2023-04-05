import { encode } from "gpt-token-utils";

export default (message: string): string[] => {
    return encode(message).matchedTextSegments;
};
