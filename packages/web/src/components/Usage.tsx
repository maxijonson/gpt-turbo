import { Stack, Text, Title } from "@mantine/core";
import { Conversation } from "gpt-turbo";
import useConversationManager from "../hooks/useConversationManager";
import UsageMetric from "./UsageMetric";
import getPriceString from "../utils/getPriceString";

interface UsageProps {
    conversation: Conversation;
}

export default ({ conversation }: UsageProps) => {
    const { getConversationName } = useConversationManager();

    const metrics: {
        label: React.ReactNode;
        value: React.ReactNode;
        description: React.ReactNode;
    }[] = [
        {
            label: "Cumulative Size",
            value: `${conversation.getCumulativeSize()} tkns`,
            description: "Cumulative number of tokens sent to OpenAI",
        },
        {
            label: "Cumulative Cost",
            value: getPriceString(conversation.getCumulativeCost()),
            description: "Cumulative cost of tokens sent to OpenAI",
        },
        {
            label: "Conversation Size",
            value: `${conversation.getSize()} tkns`,
            description: "Current number of tokens in this conversation",
        },
        {
            label: "Conversation Cost",
            value: getPriceString(conversation.getCost()),
            description: "Current cost of tokens in this conversation",
        },
    ];

    return (
        <Stack>
            <Stack spacing={1}>
                <Title order={5} align="center">
                    Usage
                </Title>
                <Text italic size="xs" align="center">
                    {getConversationName(conversation.id)}
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
