import { ConversationMessage } from "@maxijonson/gpt-turbo";
import { Box, Text } from "ink";
import React from "react";

export const SENDER_USER = "You";
export const SENDER_ASSISTANT = "GPT";
export const SENDER_SYSTEM = "SYS";
export const SENDER_SUFFIX = ": ";
export const SENDER_WIDTH = [
    SENDER_USER,
    SENDER_ASSISTANT,
    SENDER_SYSTEM,
].reduce(
    (max, sender) => Math.max(max, sender.length + SENDER_SUFFIX.length),
    0
);

interface MessageProps {
    message: Pick<ConversationMessage, "role"> & {
        content: React.ReactNode;
    };
}

export default ({ message }: MessageProps) => {
    const sender = (() => {
        switch (message.role) {
            case "assistant":
                return SENDER_ASSISTANT;
            case "system": // Shouldn't happen, but just in case
                return SENDER_SYSTEM;
            case "user":
            default:
                return SENDER_USER;
        }
    })();
    return (
        <Box>
            <Box width={SENDER_WIDTH}>
                <Text bold>{sender}: </Text>
            </Box>
            <Box flexGrow={1}>
                <Text>{message.content}</Text>
            </Box>
        </Box>
    );
};
