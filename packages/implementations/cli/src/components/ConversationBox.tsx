import { Message, ModerationException } from "gpt-turbo";
import { Box, Key, Text, useInput } from "ink";
import React from "react";
import { useElementDimensions } from "../hooks/useElementDimensions.js";
import usePagedMessages from "../hooks/usePagedMessages.js";
import BoxTitle from "./BoxTitle.js";
import Msg, { SENDER_WIDTH } from "./Message.js";
import { FOCUSID_CONVERSATION } from "../config/constants.js";
import Prompt from "./Prompt.js";
import useCustomFocus from "../hooks/useCustomFocus.js";
import useConfig from "../hooks/useConfig.js";
import useConversationManager from "../hooks/useConversationManager.js";

export default () => {
    const { conversation } = useConversationManager();
    const { model } = useConfig();

    const [error, setError] = React.useState<string | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isStreaming, setIsStreaming] = React.useState(false);
    const [pendingMessage, setPendingMessage] = React.useState<string | null>(
        null
    );
    const [messages, setMessages] = React.useState<Message[]>(
        conversation?.getMessages() ?? []
    );

    const pageableMessages = React.useMemo(() => {
        const baseMessages = messages.slice();
        if (pendingMessage) {
            baseMessages.push(new Message("user", pendingMessage, model));
        }
        if (error) {
            baseMessages.push(new Message("system", error, model));
        }
        return baseMessages;
    }, [error, messages, model, pendingMessage]);

    const {
        ref: messagesBoxRef,
        width: messagesBoxWidth,
        height: messagesBoxHeight,
    } = useElementDimensions();
    const { isFocused } = useCustomFocus({
        id: FOCUSID_CONVERSATION,
    });
    const { pages, pageIndex, setPageIndex } = usePagedMessages(
        pageableMessages,
        Math.max(0, messagesBoxWidth - SENDER_WIDTH),
        messagesBoxHeight
    );

    const onSubmit = React.useCallback(
        async (prompt: string) => {
            if (pendingMessage || !conversation) return;
            setError(null);
            setPendingMessage(prompt);
            setIsLoading(true);
            try {
                await conversation.prompt(prompt);
            } catch (e) {
                if (e instanceof Error) {
                    if (!(e instanceof ModerationException)) {
                        console.error(e.message);
                    }
                    setError(e.message);
                } else {
                    console.error("An unknown error occurred");
                    setError("An unknown error occurred");
                }
            }
            setPendingMessage(null);
            setIsLoading(false);
        },
        [conversation, pendingMessage]
    );

    const paginationDisplay = React.useMemo(() => {
        if (pages.length <= 1) return null;
        return pages.map((_, i) => `${i === pageIndex ? "●" : "○"}`).join(" ");
    }, [pageIndex, pages]);

    const handleInput = React.useCallback(
        (_input: string, key: Key) => {
            if (key.leftArrow) {
                setPageIndex((current) => current - 1);
            }

            if (key.rightArrow) {
                setPageIndex((current) => current + 1);
            }
        },
        [setPageIndex]
    );
    useInput(handleInput, { isActive: isFocused });

    React.useEffect(() => {
        if (!conversation) return;
        const unsubscribeMessageUpdate: (() => void)[] = [];
        const unsubscribeMessageStreaming: (() => void)[] = [];
        const unsubscribeMessageAdded = conversation.onMessageAdded(
            (message) => {
                if (message.role === "system") return;
                setPendingMessage(null);
                setMessages((messages) => [...messages, message]);

                if (message.role !== "assistant") return;

                unsubscribeMessageUpdate.push(
                    message.onMessageUpdate(
                        () => setMessages((messages) => [...messages]) // Force re-render by creating a new array
                    )
                );

                unsubscribeMessageStreaming.push(
                    message.onMessageStreamingUpdate((streaming) => {
                        setIsStreaming(streaming);
                    })
                );
            }
        );

        return () => {
            unsubscribeMessageAdded();
            unsubscribeMessageUpdate.forEach((unsubscribe) => unsubscribe());
            unsubscribeMessageStreaming.forEach((unsubscribe) => unsubscribe());
        };
    }, [conversation]);

    React.useEffect(() => {
        if (!conversation) return;
        return conversation.onMessageRemoved((message) => {
            setMessages((messages) =>
                messages.filter((m) => m.id !== message.id)
            );
        });
    }, [conversation]);

    React.useEffect(() => {
        setPageIndex();
    }, [messages, setPageIndex]);

    return (
        <Box
            borderStyle="round"
            flexGrow={1}
            flexDirection="column"
            paddingX={1}
        >
            <BoxTitle title="Conversation" />
            <Box ref={messagesBoxRef} flexGrow={1} flexDirection="column">
                {pages.at(pageIndex)?.map((message) => (
                    <Msg key={message.id} message={message} />
                ))}
            </Box>
            <Box
                width="100%"
                justifyContent="center"
                minHeight={1}
                flexShrink={0}
            >
                <Text wrap="wrap">{paginationDisplay}</Text>
            </Box>
            <Prompt onSubmit={onSubmit} loading={isLoading || isStreaming} />
        </Box>
    );
};
