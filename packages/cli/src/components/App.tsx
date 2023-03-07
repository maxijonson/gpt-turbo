import { ChatCompletionModel, Conversation } from "@maxijonson/gpt-turbo";
import { Box } from "ink";
import React from "react";
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
