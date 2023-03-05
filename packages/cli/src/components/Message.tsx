import { ConversationMessage } from "@maxijonson/gpt-turbo";
import { Box, Text } from "ink";
import React from "react";

interface MessageProps {
    message: Pick<ConversationMessage, "role"> & {
        content: React.ReactNode;
    };
}

export default ({ message }: MessageProps) => {
    const sender = (() => {
        switch (message.role) {
            case "assistant":
                return "GPT";
            case "system": // Shouldn't happen, but just in case
                return "SYS";
            case "user":
            default:
                return "You";
        }
    })();
    return (
        <Box>
            <Box width={8}>
                <Text bold>{sender}: </Text>
            </Box>
            <Box flexGrow={1}>
                <Text>{message.content}</Text>
            </Box>
        </Box>
    );
};
