import { Conversation, ConversationMessage } from "@maxijonson/gpt-turbo";
import { Box } from "ink";
import Spinner from "ink-spinner";
import React from "react";
import BoxTitle from "./BoxTitle.js";
import Message from "./Message.js";
import Prompt from "./Prompt.js";

interface ConversationBoxProps {
    conversation: Conversation;
}

export default ({ conversation }: ConversationBoxProps) => {
    const [pending, setPending] = React.useState<string | null>(null);
    const [messages, setMessages] = React.useState<ConversationMessage[]>([]);

    const onSubmit = async (prompt: string) => {
        if (pending) return;
        setPending(prompt);
        await conversation.prompt(prompt);
        setPending(null);
    };

    React.useEffect(() => {
        const listener = conversation.onMessageAdded(() => {
            setMessages(conversation.getMessages());
        });
        return () => listener();
    }, [conversation]);

    return (
        <Box borderStyle="round" flexGrow={1} flexDirection="column">
            <BoxTitle title="Conversation" />
            <Box flexGrow={1} flexDirection="column">
                {messages.map((message) => (
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
