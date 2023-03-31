import { Box, Text } from "ink";
import React from "react";
import {
    FOCUSID_APP,
    FOCUSID_CONVERSATION,
    FOCUSID_PROMPT,
} from "../config/constants.js";
import useAppFocus from "../hooks/useAppFocus.js";
import BoxTitle from "./BoxTitle.js";

export interface Command {
    label: string;
    command: string;
}

const DEFAULT_COMMANDS: Command[] = [
    { label: "Cycle Focus", command: "Tab" },
    { label: "Focus Prompt", command: "p" },
];

export default () => {
    const { activeId } = useAppFocus();

    const commands = React.useMemo<Command[]>(() => {
        switch (activeId) {
            case FOCUSID_CONVERSATION:
                return [
                    ...DEFAULT_COMMANDS,
                    { label: "Prev Page", command: "<-" },
                    { label: "Next Page", command: "->" },
                ];
            case FOCUSID_APP:
                return [
                    ...DEFAULT_COMMANDS,
                    { label: "Toggle Debug", command: "d" },
                    { label: "Toggle Usage", command: "u" },
                ];
            case FOCUSID_PROMPT:
                return [
                    ...DEFAULT_COMMANDS.filter(
                        ({ label }) => label !== "Focus Prompt"
                    ),
                    { label: "Submit", command: "Enter" },
                ];
            default:
                return DEFAULT_COMMANDS;
        }
    }, [activeId]);

    const focusedName = React.useMemo(() => {
        switch (activeId) {
            case FOCUSID_CONVERSATION:
                return "Conversation";
            case FOCUSID_PROMPT:
                return "Prompt";
            case FOCUSID_APP:
                return "App";
            default:
                return "";
        }
    }, [activeId]);

    return (
        <Box borderStyle="round" flexDirection="column" flexGrow={1}>
            <BoxTitle title="Commands" />
            <Box flexDirection="column" alignItems="center" width="100%">
                <Text>{focusedName}</Text>
            </Box>
            <Box>
                <Box flexDirection="column">
                    {commands.map(({ label }) => (
                        <Text key={label}>{label}</Text>
                    ))}
                </Box>
                <Box flexDirection="column">
                    {commands.map(({ command }) => (
                        <Text key={command}>{": " + command}</Text>
                    ))}
                </Box>
            </Box>
        </Box>
    );
};
