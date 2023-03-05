import { Conversation } from "@maxijonson/gpt-turbo";
import { Box, Text } from "ink";
import React from "react";
import BoxTitle from "./BoxTitle.js";

interface UsageBoxProps {
    conversation: Conversation;
}

export default ({ conversation }: UsageBoxProps) => {
    const [size, setSize] = React.useState(0);
    const [cost, setCost] = React.useState(0);

    React.useEffect(() => {
        const listener = conversation.onMessageAdded(() => {
            setSize(conversation.getCumulativeSize());
            setCost(conversation.getCumulativeCost());
        });
        return () => listener();
    }, [conversation]);

    return (
        <Box borderStyle="round" flexDirection="column" height={6}>
            <BoxTitle title="Usage" />
            <Box>
                <Box flexDirection="column">
                    <Text>Cumul. Tokens: </Text>
                    <Text>Cumul. Cost: </Text>
                </Box>
                <Box flexDirection="column">
                    <Text>{size}</Text>
                    <Text>${cost.toFixed(5)}</Text>
                </Box>
            </Box>
        </Box>
    );
};
