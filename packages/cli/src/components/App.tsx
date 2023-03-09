import { ChatCompletionModel, Conversation } from "gpt-turbo";
import { Box, useInput } from "ink";
import React from "react";
import { FOCUSID_APP } from "../config/constants.js";
import useCustomFocus from "../hooks/useCustomFocus.js";
import useStdoutDimensions from "../hooks/useStdoutDimensions.js";
import CommandsBox from "./CommandsBox.js";
import ConversationBox from "./ConversationBox.js";
import DebugBox from "./DebugBox.js";
import UsageBox from "./UsageBox.js";

interface AppProps {
    // GPT Turbo Props
    apiKey: string;
    model?: ChatCompletionModel;
    dry?: boolean;
    context?: string;
}

export default ({ apiKey, context, dry, model }: AppProps) => {
    const conversation = React.useMemo(
        () =>
            new Conversation({
                apiKey,
                model,
                dry,
                context,
            }),
        [apiKey, context, dry, model]
    );
    const [cols, rows] = useStdoutDimensions();
    const { isFocused } = useCustomFocus({
        id: FOCUSID_APP,
    });
    const [showDebug, setShowDebug] = React.useState(false);
    const [showUsage, setShowUsage] = React.useState(true);

    const handleInput = React.useCallback((input: string) => {
        if (input === "d") {
            setShowDebug((showDebug) => !showDebug);
        }
        if (input === "u") {
            setShowUsage((showUsage) => !showUsage);
        }
    }, []);
    useInput(handleInput, { isActive: isFocused });

    return (
        <Box width={cols} height={rows}>
            <Box
                flexDirection="column"
                width="20%"
                minWidth={32}
                flexShrink={0}
            >
                {showUsage && <UsageBox conversation={conversation} />}
                <CommandsBox />
            </Box>
            <ConversationBox conversation={conversation} />
            {showDebug && (
                <Box
                    flexDirection="column"
                    width="20%"
                    minWidth={32}
                    flexShrink={0}
                >
                    <DebugBox />
                </Box>
            )}
        </Box>
    );
};
