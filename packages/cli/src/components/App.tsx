import { Conversation } from "gpt-turbo";
import { Box, useInput } from "ink";
import React from "react";
import { FOCUSID_APP } from "../config/constants.js";
import useConfig from "../hooks/useConfig.js";
import useCustomFocus from "../hooks/useCustomFocus.js";
import useStdoutDimensions from "../hooks/useStdoutDimensions.js";
import ApiKeyWarning from "./ApiKeyWarning.js";
import CommandsBox from "./CommandsBox.js";
import ConversationBox from "./ConversationBox.js";
import DebugBox from "./DebugBox.js";
import UsageBox from "./UsageBox.js";

interface AppProps {
    // GPT Turbo Props
    apiKey?: string;
    model?: string;
    dry?: boolean;
    context?: string;
    disableModeration?: boolean | "soft";

    // CLI Props
    showUsage?: boolean;
    showDebug?: boolean;
}

export default (props: AppProps) => {
    const [conversation, setConversation] = React.useState<Conversation | null>(
        null
    );
    const { apiKey, dry, model, context, disableModeration } = useConfig();
    const [cols, rows] = useStdoutDimensions();
    const { isFocused } = useCustomFocus({
        id: FOCUSID_APP,
    });
    const [showDebug, setShowDebug] = React.useState(props.showDebug ?? false);
    const [showUsage, setShowUsage] = React.useState(props.showUsage ?? true);

    const handleInput = React.useCallback((input: string) => {
        if (input === "d") {
            setShowDebug((showDebug) => !showDebug);
        }
        if (input === "u") {
            setShowUsage((showUsage) => !showUsage);
        }
    }, []);
    useInput(handleInput, { isActive: isFocused });

    React.useEffect(() => {
        if (!apiKey && !dry) return;
        setConversation(
            new Conversation({
                dry,
                model,
                apiKey,
                context,
                disableModeration,
                stream: true,
            })
        );
    }, [apiKey, context, disableModeration, dry, model]);

    if (!apiKey && !dry) {
        return <ApiKeyWarning />;
    }

    if (!conversation) return null;
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
