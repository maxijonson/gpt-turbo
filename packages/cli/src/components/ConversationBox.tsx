import {
    Conversation,
    ConversationMessage,
    getMessageSize,
} from "@maxijonson/gpt-turbo";
import { Box, Spacer, Text } from "ink";
import Spinner from "ink-spinner";
import TextInput from "ink-text-input";
import React from "react";
import BoxTitle from "./BoxTitle";

interface ConversationBoxProps {
    conversation: Conversation;
}

const SENDER_WIDTH = 8;

export default ({ conversation }: ConversationBoxProps) => {
    const [prompt, setPrompt] = React.useState("");
    const [pending, setPending] = React.useState<string | null>(null);
    const [messages, setMessages] = React.useState<ConversationMessage[]>([]);

    const onSubmit = async () => {
        if (!prompt || pending) return;
        setPending(prompt);
        setPrompt("");
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
                    <Box key={message.id}>
                        <Box width={SENDER_WIDTH}>
                            <Text bold>
                                {message.role === "user" ? "You" : "GPT"}:{" "}
                            </Text>
                        </Box>
                        <Box flexGrow={1}>
                            <Text>{message.content}</Text>
                        </Box>
                    </Box>
                ))}
                {pending && (
                    <>
                        <Box>
                            <Box width={SENDER_WIDTH}>
                                <Text bold>You: </Text>
                            </Box>
                            <Box flexGrow={1}>
                                <Text>{pending}</Text>
                            </Box>
                        </Box>
                        <Box>
                            <Box width={SENDER_WIDTH}>
                                <Text bold>GPT: </Text>
                            </Box>
                            <Box flexGrow={1}>
                                <Spinner />
                            </Box>
                        </Box>
                    </>
                )}
            </Box>
            <Spacer />
            <Box minHeight={3} flexShrink={0} borderStyle="single">
                <Box flexGrow={1}>
                    <TextInput
                        value={prompt}
                        onChange={setPrompt}
                        placeholder=" Prompt"
                        onSubmit={onSubmit}
                    />
                </Box>
                <Text>({getMessageSize(prompt)} Tokens)</Text>
            </Box>
        </Box>
    );
};
