import { getMessageSize } from "@maxijonson/gpt-turbo";
import { Box, Text } from "ink";
import Spinner from "ink-spinner";
import TextInput from "ink-text-input";
import React from "react";
import { FOCUSID_PROMPT } from "../config/constants.js";
import useCustomFocus from "../hooks/useCustomFocus.js";

interface PromptProps {
    onSubmit: (prompt: string) => void;
    loading?: boolean;
}

export default ({ onSubmit, loading = false }: PromptProps) => {
    const [prompt, setPrompt] = React.useState("");
    const { isFocused } = useCustomFocus({
        autoFocus: true,
        id: FOCUSID_PROMPT,
    });

    const handleSubmit = async () => {
        if (!prompt) return;
        setPrompt("");
        onSubmit(prompt);
    };

    const tokensStr = `(${getMessageSize(prompt)} Tokens)`;

    return (
        <Box minHeight={3} flexShrink={0} borderStyle="single">
            <Box flexGrow={1}>
                {loading && <Spinner />}
                <TextInput
                    value={loading ? "" : prompt}
                    showCursor={!loading}
                    onChange={setPrompt}
                    placeholder={loading ? undefined : " Prompt"}
                    onSubmit={handleSubmit}
                    focus={isFocused}
                />
            </Box>
            <Box flexShrink={0} width={tokensStr.length + 2}>
                <Text>{tokensStr}</Text>
            </Box>
        </Box>
    );
};
