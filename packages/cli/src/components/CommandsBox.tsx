import { Box, Text } from "ink";
import React from "react";
import BoxTitle from "./BoxTitle.js";

interface CommandsBoxProps {}

const COMMANDS = [
    { label: "Toggle Focus", command: "Tab" },
    { label: "Prev Page", command: "<-" },
    { label: "Next Page", command: "->" },
] as const;

export default ({}: CommandsBoxProps) => {
    return (
        <Box borderStyle="round" flexDirection="column" flexGrow={1}>
            <BoxTitle title="Commands" />
            <Box>
                <Box flexDirection="column">
                    {COMMANDS.map(({ label }) => (
                        <Text key={label}>{label}</Text>
                    ))}
                </Box>
                <Box flexDirection="column">
                    {COMMANDS.map(({ command }) => (
                        <Text key={command}>{": " + command}</Text>
                    ))}
                </Box>
            </Box>
        </Box>
    );
};
