import { Conversation } from "@maxijonson/gpt-turbo";
import { Box, Text } from "ink";
import React from "react";
import BoxTitle from "./BoxTitle";

interface InfoBoxProps {
    conversation: Conversation;
}

export default ({ conversation }: InfoBoxProps) => {
    const [size, setSize] = React.useState(0);
    const [cost, setCost] = React.useState(0);

    React.useEffect(() => {
        const listener = conversation.onMessageAdded(() => {
            setSize(conversation.getSize());
            setCost(conversation.getCost());
        });
        return () => listener();
    }, [conversation]);

    return (
        <Box borderStyle="round" flexDirection="column" flexGrow={2}>
            <BoxTitle title="Info" />
            <Box>
                <Box flexDirection="column">
                    <Text>Convo. Tokens: </Text>
                    <Text>Convo. Cost: </Text>
                </Box>
                <Box flexDirection="column">
                    <Text>{size}</Text>
                    <Text>${cost.toFixed(5)}</Text>
                </Box>
            </Box>
        </Box>
    );
};
