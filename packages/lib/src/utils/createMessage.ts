import { ChatCompletionRequestMessageRoleEnum } from "openai";
import { ConversationMessage } from "./types.js";
import { v4 as uuid } from "uuid";

export default (
    content: string,
    role: ChatCompletionRequestMessageRoleEnum
): ConversationMessage => {
    return { id: uuid(), role, content, flags: null };
};
