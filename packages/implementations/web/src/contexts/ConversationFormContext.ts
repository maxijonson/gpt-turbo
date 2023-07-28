import { createFormContext } from "@mantine/form";
import {
    CreateChatCompletionRequest,
    ConversationRequestOptionsModel,
} from "gpt-turbo";

export interface ConversationFormValues {
    save: boolean;

    // Config
    apiKey: string;
    model: string;
    context: string;
    dry: boolean;
    disableModeration: boolean | "soft";
    stream: boolean;
    temperature: CreateChatCompletionRequest["temperature"];
    top_p: CreateChatCompletionRequest["top_p"];
    frequency_penalty: CreateChatCompletionRequest["frequency_penalty"];
    presence_penalty: CreateChatCompletionRequest["presence_penalty"];
    stop: CreateChatCompletionRequest["stop"];
    max_tokens: CreateChatCompletionRequest["max_tokens"];
    logit_bias: CreateChatCompletionRequest["logit_bias"];
    user: CreateChatCompletionRequest["user"];

    // Request options
    headers: ConversationRequestOptionsModel["headers"];
    proxy: ConversationRequestOptionsModel["proxy"];

    // Callable functions
    functionIds: string[];
}

const [FormProvider, useFormContext, useForm] =
    createFormContext<ConversationFormValues>();

export const ConversationFormContext = {
    Provider: FormProvider,
    useContext: useFormContext,
    useForm,
};
