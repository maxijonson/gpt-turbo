import { ChatCompletionModel, Conversation } from "@maxijonson/gpt-turbo";
import { Box } from "ink";
import useStdoutDimensions from "ink-use-stdout-dimensions";
import React from "react";
import ConversationBox from "./ConversationBox";
import DebugBox from "./DebugBox";
import InfoBox from "./InfoBox";
import UsageBox from "./UsageBox";

interface AppProps {
    // GPT Turbo Props
    apiKey: string;
    model?: ChatCompletionModel;
    dry?: boolean;
    context?: string;

    // CLI Props
    showUsage?: boolean;
}

export default ({ showUsage, apiKey, context, dry, model }: AppProps) => {
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
            <Box flexDirection="column" width="20%">
                {showUsage && <UsageBox conversation={conversation} />}
                <InfoBox conversation={conversation} />
            </Box>
            <ConversationBox conversation={conversation} />
            <Box flexDirection="column" width="20%">
                <DebugBox />
            </Box>
        </Box>
    );
};
