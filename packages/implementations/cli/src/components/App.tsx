import { Conversation } from "gpt-turbo";
import { Box, Text, useInput } from "ink";
import React from "react";
import { FOCUSID_APP } from "../config/constants.js";
import useConfig from "../hooks/useConfig.js";
import useConversationManager from "../hooks/useConversationManager.js";
import useCustomFocus from "../hooks/useCustomFocus.js";
import usePersistence from "../hooks/usePersistence.js";
import useStdoutDimensions from "../hooks/useStdoutDimensions.js";
import ApiKeyWarning from "./ApiKeyWarning.js";
import CommandsBox from "./CommandsBox.js";
import ConversationBox from "./ConversationBox.js";
import DebugBox from "./DebugBox.js";
import UsageBox from "./UsageBox.js";

interface AppProps {
    showUsage?: boolean;
    showDebug?: boolean;
    saveFile?: string;
    loadFile?: string;
}

export default ({
    showUsage: initialShowUsage = true,
    showDebug: initialShowDebug = false,
    saveFile,
    loadFile,
}: AppProps) => {
    const { setSaveFile, setLoadFile } = usePersistence();
    const { conversation, setConversation } = useConversationManager();
    const { apiKey, dry, model, context, disableModeration, stream } =
        useConfig();
    const [cols, rows] = useStdoutDimensions();
    const { isFocused } = useCustomFocus({
        id: FOCUSID_APP,
    });
    const [showUsage, setShowUsage] = React.useState(initialShowUsage);
    const [showDebug, setShowDebug] = React.useState(initialShowDebug);

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
        if ((!apiKey && !dry) || loadFile) return;
        setConversation(
            new Conversation({
                config: {
                    dry,
                    model,
                    apiKey,
                    context,
                    disableModeration,
                    stream,
                },
            })
        );
    }, [
        apiKey,
        context,
        disableModeration,
        dry,
        loadFile,
        model,
        setConversation,
        stream,
    ]);

    React.useEffect(() => {
        if (saveFile) {
            setSaveFile(saveFile);
        }
    }, [saveFile, setSaveFile]);

    React.useEffect(() => {
        if (loadFile) {
            setLoadFile(loadFile);
        }
    }, [loadFile, setLoadFile]);

    if (!apiKey && !dry) {
        return <ApiKeyWarning />;
    }

    if (!conversation) return <Text>Conversation not initialized.</Text>;
    return (
        <Box width={cols} height={rows}>
            <Box
                flexDirection="column"
                width="20%"
                minWidth={32}
                flexShrink={0}
            >
                {showUsage && <UsageBox />}
                <CommandsBox />
            </Box>
            <ConversationBox />
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
