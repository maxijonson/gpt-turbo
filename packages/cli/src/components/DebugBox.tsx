import { Box, Text } from "ink";
import React from "react";
import useDebug from "../hooks/useDebug";
import BoxTitle from "./BoxTitle";

interface DebugBoxProps {}

export default ({}: DebugBoxProps) => {
    const { logs } = useDebug();

    return (
        <Box borderStyle="round" flexDirection="column" flexGrow={1}>
            <BoxTitle title="Debug" />
            {logs.map((log, index) => (
                <Text key={index}>{log}</Text>
            ))}
        </Box>
    );
};
