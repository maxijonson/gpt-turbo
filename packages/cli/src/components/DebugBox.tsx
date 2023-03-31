import { Box, Text } from "ink";
import React from "react";
import useDebug from "../hooks/useDebug.js";
import BoxTitle from "./BoxTitle.js";

export default () => {
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
