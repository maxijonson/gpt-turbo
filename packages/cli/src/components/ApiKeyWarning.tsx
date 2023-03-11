import React from "react";
import { Box, Key, Text, useApp, useInput } from "ink";
import useStdoutDimensions from "../hooks/useStdoutDimensions.js";
import useCycle from "../hooks/useCycle.js";
import CenteredText from "./CenteredText.js";
import useConfig from "../hooks/useConfig.js";
import TextInput from "ink-text-input";

interface ApiKeyWarningProps {}

const ACTIONS = [
    {
        id: "exit",
        label: "Exit",
    },
    {
        id: "apikey",
        label: "Set Key",
    },
    {
        id: "dry",
        label: "Dry Run",
    },
] as const;

export default ({}: ApiKeyWarningProps) => {
    const [cols, rows] = useStdoutDimensions();
    const { item, cycleNext, cyclePrevious } = useCycle(ACTIONS);
    const { exit } = useApp();
    const [showApiKeyForm, setShowApiKeyForm] = React.useState(false);
    const [apiKeyInput, setApiKeyInput] = React.useState("");
    const { setDry, setApiKey } = useConfig();

    const handleApiKeyChange = React.useCallback((input: string) => {
        setApiKeyInput(input.replace(/[^A-Za-z0-9\-_]/g, ""));
    }, []);

    const handleOptionSelect = React.useCallback(() => {
        switch (item.id) {
            case "exit":
                exit();
                break;
            case "dry":
                setDry(true);
                break;
            case "apikey":
                setShowApiKeyForm(true);
                break;
        }
    }, [exit, item.id, setDry]);

    const handleInput = React.useCallback(
        (_: string, key: Key) => {
            if (showApiKeyForm) {
                if (key.escape) {
                    setShowApiKeyForm(false);
                }
            } else {
                if (key.leftArrow) {
                    cyclePrevious();
                }

                if (key.rightArrow) {
                    cycleNext();
                }

                if (key.return) {
                    handleOptionSelect();
                }

                if (key.escape) {
                    exit();
                }
            }
        },
        [cycleNext, cyclePrevious, exit, handleOptionSelect, showApiKeyForm]
    );
    useInput(handleInput, { isActive: true });

    return (
        <Box
            width={cols}
            height={rows}
            justifyContent="center"
            alignItems="center"
        >
            <Box
                flexDirection="column"
                width="80%"
                minWidth={32}
                flexShrink={0}
                borderStyle="round"
                alignItems="center"
                padding={1}
            >
                {showApiKeyForm ? (
                    <Box borderStyle="single" paddingX={1} width="100%">
                        <TextInput
                            value={apiKeyInput}
                            onChange={handleApiKeyChange}
                            placeholder="OpenAI API Key"
                            onSubmit={setApiKey}
                        />
                    </Box>
                ) : (
                    <>
                        <CenteredText bold>
                            No API key was provided as argument (-k) or in the
                            environment (GPTTURBO_APIKEY).
                        </CenteredText>
                        <Box>
                            {ACTIONS.map((action, i) => (
                                <Box
                                    key={action.id}
                                    paddingX={
                                        i === 0 || i === ACTIONS.length - 1
                                            ? 2
                                            : 0
                                    }
                                >
                                    <Text inverse={item.id === action.id}>
                                        {action.label}
                                    </Text>
                                </Box>
                            ))}
                        </Box>
                    </>
                )}
            </Box>
        </Box>
    );
};
