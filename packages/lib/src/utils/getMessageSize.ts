import { encode } from "gpt-3-encoder";

export default (message: string) => {
    return encode(message).length;
};
