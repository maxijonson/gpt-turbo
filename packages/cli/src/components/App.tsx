import { ChatCompletionModel, Conversation } from "gpt-turbo";
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
    model?: ChatCompletionModel;
    dry?: boolean;
    context?: string;

    // CLI Props
    showUsage?: boolean;
    showDebug?: boolean;
}

export default (props: AppProps) => {
    const [conversation, setConversation] = React.useState<Conversation | null>(
        null
    );
    const {
        apiKey,
        context,
        dry,
        model,
        setApiKey,
        setContext,
        setDry,
        setModel,
    } = useConfig();

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

    React.useEffect(() => {
        if (props.apiKey) setApiKey(props.apiKey);
        if (props.model) setModel(props.model);
        if (props.dry !== undefined) setDry(props.dry);
        if (props.context) setContext(props.context);

        if (props.showUsage !== undefined) setShowUsage(props.showUsage);
        if (props.showDebug !== undefined) setShowDebug(props.showDebug);
    }, [
        props.apiKey,
        props.context,
        props.dry,
        props.model,
        props.showDebug,
        props.showUsage,
        setApiKey,
        setContext,
        setDry,
        setModel,
    ]);

    React.useEffect(() => {
        if (!apiKey && !dry) return;
        setConversation(
            new Conversation({
                dry,
                model,
                apiKey,
                context,
            })
        );
    }, [apiKey, context, dry, model]);

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
