import { Message } from "gpt-turbo";
import { Box, Text } from "ink";
import React from "react";

export const SENDER_USER = "You";
export const SENDER_ASSISTANT = "GPT";
export const SENDER_SYSTEM = "SYS";
export const SENDER_FUNCTION = "FUN";
export const SENDER_SUFFIX = ": ";
export const SENDER_WIDTH = [
    SENDER_USER,
    SENDER_ASSISTANT,
    SENDER_SYSTEM,
    SENDER_FUNCTION,
].reduce(
    (max, sender) => Math.max(max, sender.length + SENDER_SUFFIX.length),
    0
);

interface MessageProps {
    message: Pick<Message, "role" | "flags"> & {
        content: React.ReactNode;
    };
}

export default ({ message }: MessageProps) => {
    const sender = (() => {
        switch (message.role) {
            case "assistant":
                return SENDER_ASSISTANT;
            case "system":
                return SENDER_SYSTEM;
            case "function":
                return SENDER_FUNCTION;
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
            <Box flexGrow={1} paddingRight={1}>
                <Text color={message.flags?.length ? "yellow" : "white"}>
                    {message.content}
                </Text>
            </Box>
        </Box>
    );
};
