import { Conversation, ConversationMessage } from "@maxijonson/gpt-turbo";
import { Box, Text } from "ink";
import React from "react";
import { useElementDimensions } from "../hooks/useElementDimensions.js";
import usePagedMessages from "../hooks/usePagedMessages.js";
import BoxTitle from "./BoxTitle.js";
import Message, { SENDER_WIDTH } from "./Message.js";
import Prompt from "./Prompt.js";

interface ConversationBoxProps {
    conversation: Conversation;
}

export default ({ conversation }: ConversationBoxProps) => {
    const [pending, setPending] = React.useState<string | null>(null);
    const [messages, setMessages] = React.useState<ConversationMessage[]>([]);
    const {
        ref: messagesBoxRef,
        width: messagesBoxWidth,
        height: messagesBoxHeight,
    } = useElementDimensions();
    const { pages, pageIndex, setPageIndex } = usePagedMessages(
        messages,
        Math.max(0, messagesBoxWidth - SENDER_WIDTH),
        messagesBoxHeight
    );

    const onSubmit = async (prompt: string) => {
        if (pending) return;
        setPending(prompt);
        try {
            await conversation.prompt(prompt);
        } catch (e) {
            if (e instanceof Error) {
                console.error(e.message);
            } else {
                console.error("An unknown error occurred");
            }
        }
        setPending(null);
    };

    const paginationDisplay = React.useMemo(() => {
        if (pages.length <= 1) return null;
        return pages.map((_, i) => `${i === pageIndex ? "●" : "○"}`).join(" ");
    }, [pageIndex, pages]);

    React.useEffect(() => {
        return conversation.onMessageAdded((message) => {
            setMessages((messages) => [...messages, message]);
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
                {pages.at(-1)?.map((message) => (
                    <Message key={message.id} message={message} />
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
            <Prompt onSubmit={onSubmit} loading={!!pending} />
        </Box>
    );
};
