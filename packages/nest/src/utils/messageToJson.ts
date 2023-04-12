import { Message } from "gpt-turbo";

export default (message: Message) => {
    const {
        content,
        role,
        cost,
        flags,
        id,
        isFlagged,
        isStreaming,
        model,
        size,
    } = message;

    return {
        content,
        role,
        cost,
        flags,
        id,
        isFlagged,
        isStreaming,
        model,
        size,
    };
};
