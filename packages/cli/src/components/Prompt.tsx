import { getMessageSize } from "@maxijonson/gpt-turbo";
import { Box, Text } from "ink";
import TextInput from "ink-text-input";
import React from "react";

interface PromptProps {
    onSubmit: (prompt: string) => void;
}

export default ({ onSubmit }: PromptProps) => {
    const [prompt, setPrompt] = React.useState("");

    const handleSubmit = async () => {
        if (!prompt) return;
        setPrompt("");
        onSubmit(prompt);
    };

    const tokensStr = `(${getMessageSize(prompt)} Tokens)`;

    return (
        <Box minHeight={3} flexShrink={0} borderStyle="single">
            <Box flexGrow={1}>
                <TextInput
                    value={prompt}
                    onChange={setPrompt}
                    placeholder=" Prompt"
                    onSubmit={handleSubmit}
                />
            </Box>
            <Box flexShrink={0} width={tokensStr.length + 2}>
                <Text>{tokensStr}</Text>
            </Box>
        </Box>
    );
};
