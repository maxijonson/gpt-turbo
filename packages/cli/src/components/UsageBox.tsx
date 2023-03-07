import { Conversation } from "@maxijonson/gpt-turbo";
import { Box, Text } from "ink";
import React from "react";
import BoxTitle from "./BoxTitle.js";

interface UsageBoxProps {
    conversation: Conversation;
}

const SEPARATOR = ": ";

export default ({ conversation }: UsageBoxProps) => {
    const [cumulSize, setCumulSize] = React.useState(0);
    const [cumulCost, setCumulCost] = React.useState(0);
    const [size, setSize] = React.useState(0);
    const [cost, setCost] = React.useState(0);

    React.useEffect(() => {
        const listener = conversation.onMessageAdded(() => {
            setCumulSize(conversation.getCumulativeSize());
            setCumulCost(conversation.getCumulativeCost());
            setSize(conversation.getSize());
            setCost(conversation.getCost());
        });
        return () => listener();
    }, [conversation]);

    const usages = React.useMemo<{ label: string; value: string }[]>(
        () => [
            { label: "Cumul. Tokens", value: "" + cumulSize },
            { label: "Cumul. Cost", value: "$" + cumulCost.toFixed(5) },
            { label: "Convo. Tokens", value: "" + size },
            { label: "Convo. Cost", value: "$" + cost.toFixed(5) },
        ],
        [cost, cumulCost, cumulSize, size]
    );

    const minWidth = React.useMemo(
        () =>
            Math.max(
                ...usages.map(({ label, value }) => label.length + value.length)
            ) + SEPARATOR.length,
        [usages]
    );

    return (
        <Box
            borderStyle="round"
            flexDirection="column"
            minHeight={usages.length + 3}
            minWidth={minWidth}
        >
            <BoxTitle title="Usage" />
            <Box>
                <Box flexDirection="column">
                    {usages.map(({ label }) => (
                        <Text key={label}>{label}</Text>
                    ))}
                </Box>
                <Box flexDirection="column">
                    {usages.map(({ value }, i) => (
                        <Text key={i}>
                            {SEPARATOR}
                            {value}
                        </Text>
                    ))}
                </Box>
            </Box>
        </Box>
    );
};
