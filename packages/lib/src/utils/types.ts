import { OpenAIApi, CreateChatCompletionRequest } from "openai";
import { Message } from "../classes/Message.js";

export type ChatCompletionRequestOptions = Omit<
    CreateChatCompletionRequest,
    "model" | "messages" | "stream"
>;

export type OpenAiAxiosConfig = Omit<
    Parameters<OpenAIApi["createChatCompletion"]>[1],
    "responseType"
>;

export type AddMessageListener = (message: Message) => void;
export type RemoveMessageListener = (message: Message) => void;
