import { Conversation, ConversationMessage } from "@maxijonson/gpt-turbo";
import { Box } from "ink";
import Spinner from "ink-spinner";
import React from "react";
import { useElementDimensions } from "../hooks/useElementDimensions.js";
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

    const pages = React.useMemo(() => {
        if (!messagesBoxRef.current) return [messages];
        if (!messagesBoxWidth || !messagesBoxHeight) return [messages];

        const pages: ConversationMessage[][] = [];
        let page: ConversationMessage[] = [];
        let pageHeight = 0;

        // TODO: Handle messages that are longer than the box height by splitting them into multiple messages
        for (let i = 0; i < messages.length; i++) {
            const message = messages[i];
            const messageWidth = SENDER_WIDTH + message.content.length;
            const messageHeight = Math.ceil(messageWidth / messagesBoxWidth);

            if (pageHeight + messageHeight > messagesBoxHeight) {
                pages.push(page);
                page = [];
                pageHeight = 0;
            }

            page.push(message);
            pageHeight += messageHeight;
        }

        if (page.length) {
            pages.push(page);
        }
        return pages;
    }, [messages, messagesBoxHeight, messagesBoxRef, messagesBoxWidth]);

    const onSubmit = async (prompt: string) => {
        if (pending) return;
        setPending(prompt);
        await conversation.prompt(prompt);
        setPending(null);
    };

    React.useEffect(() => {
        const listener = conversation.onMessageAdded((message) => {
            // We deep clone the message so that we can mutate it later (e.g. splitting the message when the message overflows the box)
            setMessages((messages) => [...messages, structuredClone(message)]);
        });
        return () => listener();
    }, [conversation]);

    return (
        <Box borderStyle="round" flexGrow={1} flexDirection="column">
            <BoxTitle title="Conversation" />
            <Box ref={messagesBoxRef} flexGrow={1} flexDirection="column">
                {pages.at(-1)?.map((message) => (
                    <Message key={message.id} message={message} />
                ))}
                {pending && (
                    <>
                        <Message message={{ role: "user", content: pending }} />
                        <Message
                            message={{
                                role: "assistant",
                                content: <Spinner />,
                            }}
                        />
                    </>
                )}
            </Box>
            <Prompt onSubmit={onSubmit} />
        </Box>
    );
};
