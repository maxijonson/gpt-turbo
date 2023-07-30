import { Box, Text } from "ink";
import React from "react";
import useConversationManager from "../hooks/useConversationManager.js";
import BoxTitle from "./BoxTitle.js";
import { statsPluginName } from "gpt-turbo-plugin-stats";

const SEPARATOR = ": ";

export default () => {
    const [, forceUpdate] = React.useReducer((x) => x + 1, 0);
    const { conversation } = useConversationManager();
    const stats =
        conversation?.plugins.getPluginOutput(statsPluginName) ?? null;

    const usages: {
        label: string;
        value: string;
    }[] = React.useMemo(
        () => [
            {
                label: "Cumul. Size",
                value: `${stats?.cumulativeSize ?? 0} tkns`,
            },
            {
                label: "Cumul. Cost",
                value: `$${stats?.cumulativeCost.toFixed(5) ?? 0}`,
            },
            {
                label: "Convo. Size",
                value: `${stats?.size ?? 0} tkns`,
            },
            {
                label: "Convo. Cost",
                value: `$${stats?.cost.toFixed(5) ?? 0}`,
            },
        ],
        [stats?.cost, stats?.cumulativeCost, stats?.cumulativeSize, stats?.size]
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
        const offMessageAdded = conversation.history.onMessageAdded(
            (message) => {
                offs.push(
                    message.onStreamingUpdate(() => forceUpdate()),
                    message.onUpdate(() => forceUpdate())
                );
            }
        );

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
