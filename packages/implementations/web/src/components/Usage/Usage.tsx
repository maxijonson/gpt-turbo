import { Stack, Text, Title } from "@mantine/core";
import { Conversation } from "gpt-turbo";
import UsageMetric from "./UsageMetric";
import getPriceString from "../../utils/getPriceString";
import { useGetConversationName } from "../../store/hooks/conversations/useGetConversationName";
import { DEFAULT_CONVERSATION_NAME } from "../../config/constants";
import { statsPluginName } from "gpt-turbo-plugin-stats";
import React from "react";
import { useForceUpdate } from "@mantine/hooks";

interface UsageProps {
    conversation: Conversation;
}

const Usage = ({ conversation }: UsageProps) => {
    const getConversationName = useGetConversationName();
    const forceUpdate = useForceUpdate();
    const stats = conversation.plugins.getPluginOutput(statsPluginName);

    const metrics: {
        label: React.ReactNode;
        value: React.ReactNode;
        description: React.ReactNode;
    }[] = [
        {
            label: "Cumulative Size",
            value: `${stats.cumulativeSize} tkns`,
            description: "Cumulative number of tokens sent to OpenAI",
        },
        {
            label: "Cumulative Cost",
            value: getPriceString(stats.cumulativeCost),
            description: "Cumulative cost of tokens sent to OpenAI",
        },
        {
            label: "Conversation Size",
            value: `${stats.size} tkns`,
            description: "Current number of tokens in this conversation",
        },
        {
            label: "Conversation Cost",
            value: getPriceString(stats.cost),
            description: "Current cost of tokens in this conversation",
        },
    ];

    React.useEffect(() => {
        stats.onStatsUpdate(() => forceUpdate());
    }, [forceUpdate, stats]);

    return (
        <Stack>
            <Stack spacing={1}>
                <Title order={5} align="center">
                    Usage
                </Title>
                <Text italic size="xs" align="center">
                    {getConversationName(conversation.id) ??
                        DEFAULT_CONVERSATION_NAME}
                </Text>
            </Stack>
            {metrics.map((metric, i) => (
                <UsageMetric
                    key={metric.label?.toString() ?? i}
                    label={metric.label}
                    value={metric.value}
                    description={metric.description}
                />
            ))}
        </Stack>
    );
};

export default Usage;
