import { ChatCompletionModel, Conversation } from "@maxijonson/gpt-turbo";
import { Box } from "ink";
import React from "react";
import useStdoutDimensions from "../hooks/useStdoutDimensions.js";
import ConversationBox from "./ConversationBox.js";
import DebugBox from "./DebugBox.js";
import InfoBox from "./InfoBox.js";
import UsageBox from "./UsageBox.js";

interface AppProps {
    // GPT Turbo Props
    apiKey: string;
    model?: ChatCompletionModel;
    dry?: boolean;
    context?: string;

    // CLI Props
    showUsage?: boolean;
    showDebug?: boolean;
}

export default ({
    showUsage,
    showDebug,
    apiKey,
    context,
    dry,
    model,
}: AppProps) => {
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

    return (
        <Box width={cols} height={rows}>
            {showUsage && (
                <Box flexDirection="column" width="20%" flexShrink={0}>
                    {<UsageBox conversation={conversation} />}
                    <InfoBox conversation={conversation} />
                </Box>
            )}
            <ConversationBox conversation={conversation} />
            {showDebug && (
                <Box flexDirection="column" width="20%" flexShrink={0}>
                    <DebugBox />
                </Box>
            )}
        </Box>
    );
};
