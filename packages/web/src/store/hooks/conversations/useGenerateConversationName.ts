import React from "react";
import { useAppStore } from "../..";
import { shallow } from "zustand/shallow";
import {
    CallableFunction,
    CallableFunctionObject,
    CallableFunctionString,
    CompletionMessage,
    Conversation,
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

export const useGenerateConversationName = (conversationId: string) => {
    const [conversations, settings] = useAppStore(
        (state) => [state.conversations, state.defaultSettings],
        shallow
    );
    const [isGenerating, setIsGenerating] = React.useState(false);

    const conversation = conversations.find((c) => c.id === conversationId);

    const apiKey = settings.apiKey;
    const messages = React.useMemo(
        () => conversation?.getMessages() ?? [],
        [conversation]
    );
    const userMessage = messages[0] as CompletionMessage;
    const assistantMessage = messages[1] as CompletionMessage;

    const canGenerate = React.useMemo(
        () =>
            conversation &&
            apiKey &&
            userMessage?.isCompletion() &&
            assistantMessage?.isCompletion(),
        [apiKey, assistantMessage, conversation, userMessage]
    );

    const generateConversationName = React.useCallback(async () => {
        try {
            if (!canGenerate) return;

            setIsGenerating(true);
            const generateConversation = new Conversation({
                apiKey,
                disableModeration: true,
            });
            await generateConversation.addUserMessage(userMessage.content);
            await generateConversation.addAssistantMessage(
                assistantMessage.content
            );
            generateConversation.addFunction(generateFn);

            const result = await generateConversation.prompt(
                "Give a name to this conversation.",
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
    }, [apiKey, assistantMessage.content, canGenerate, userMessage.content]);

    return {
        canGenerate,
        isGenerating,
        generateConversationName,
    };
};
