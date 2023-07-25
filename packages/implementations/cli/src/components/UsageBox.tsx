import { Box, Text } from "ink";
import React from "react";
import useConversationManager from "../hooks/useConversationManager.js";
import BoxTitle from "./BoxTitle.js";

const SEPARATOR = ": ";

export default () => {
    const [, forceUpdate] = React.useReducer((x) => x + 1, 0);
    const { conversation } = useConversationManager();
    const cumulativeSize = conversation?.getCumulativeSize() ?? 0;
    const cumulativeCost = conversation?.getCumulativeCost() ?? 0;
    const size = conversation?.getSize() ?? 0;
    const cost = conversation?.getCost() ?? 0;

    const usages = React.useMemo<{ label: string; value: string }[]>(
        () => [
            { label: "Cumul. Tokens", value: "" + cumulativeSize },
            { label: "Cumul. Cost", value: "$" + cumulativeCost.toFixed(5) },
            { label: "Convo. Tokens", value: "" + size },
            { label: "Convo. Cost", value: "$" + cost.toFixed(5) },
        ],
        [cost, cumulativeCost, cumulativeSize, size]
    );

    const minWidth = React.useMemo(
        () =>
            Math.max(
                ...usages.map(({ label, value }) => label.length + value.length)
            ) + SEPARATOR.length,
        [usages]
    );

    React.useEffect(() => {
        if (!conversation) return;
        const offs: (() => void)[] = [];
        const offMessageAdded = conversation.onMessageAdded((message) => {
            offs.push(
                message.onMessageStreamingUpdate(() => forceUpdate()),
                message.onMessageUpdate(() => forceUpdate())
            );
        });

        return () => {
            offs.forEach((off) => off());
            offMessageAdded();
        };
    }, [conversation]);

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
