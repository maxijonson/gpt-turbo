import React from "react";
import { useAppStore } from "../..";
import { shallow } from "zustand/shallow";
import {
    CallableFunction,
    CallableFunctionObject,
    CallableFunctionString,
    ChatCompletionRequestMessageRoleEnum,
    CompletionMessage,
    Conversation,
    Message,
} from "gpt-turbo";

const generateFn = new CallableFunction(
    "setConversationName",
    "Sets the name of the conversation based on the current messages. Ideally, under 32 characters.",
    new CallableFunctionObject("_").addProperty(
        new CallableFunctionString("name", {
            description: "A short name to set the conversation name to.",
        })
    )
);

const getFirstMessageOfRole = <R extends ChatCompletionRequestMessageRoleEnum>(
    messages: Message[],
    role: R
) => {
    const message = messages.find(
        (m): m is CompletionMessage & { role: R } =>
            m.isCompletion() && m.role === role
    );
    if (!message) return null;
    return message;
};

export const useGenerateConversationName = (conversationId: string) => {
    const [conversations, settings] = useAppStore(
        (state) => [state.conversations, state.defaultSettings],
        shallow
    );
    const [isGenerating, setIsGenerating] = React.useState(false);

    const conversation = conversations.find((c) => c.id === conversationId);

    const apiKey = settings.apiKey;
    const messages = conversation?.history.getMessages() ?? [];
    const userMessage = getFirstMessageOfRole(messages, "user");
    const assistantMessage = getFirstMessageOfRole(messages, "assistant");

    const canGenerate = React.useMemo(
        () => conversation && apiKey && userMessage && assistantMessage,
        [apiKey, assistantMessage, conversation, userMessage]
    );

    const generateConversationName = React.useCallback(async () => {
        try {
            if (!canGenerate) return;

            setIsGenerating(true);
            const generateConversation = new Conversation({
                config: {
                    apiKey,
                    disableModeration: true,
                },
            });

            generateConversation.history.addUserMessage(userMessage!.content);
            generateConversation.history.addAssistantMessage(
                assistantMessage!.content
            );
            generateConversation.callableFunctions.addFunction(generateFn);

            const result = await generateConversation.prompt(
                "Give a name for this conversation based on the two previous messages.",
                { function_call: { name: generateFn.name } }
            );
            if (!result.isFunctionCall()) return;

            const { name } = result.functionCall.arguments;
            if (!name) return;
            setIsGenerating(false);

            return name as string;
        } catch (e) {
            console.error(e);
        }
    }, [apiKey, assistantMessage, canGenerate, userMessage]);

    return {
        canGenerate,
        isGenerating,
        generateConversationName,
    };
};
