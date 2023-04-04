import { Group, Text, Tooltip } from "@mantine/core";

interface UsageMetricProps {
    label: React.ReactNode;
    value: React.ReactNode;
    description: React.ReactNode;
}

export default ({ label, value, description }: UsageMetricProps) => {
    return (
        <Tooltip label={description} position="right" withArrow arrowSize={8}>
            <Group>
                <Text weight={600} sx={{ flexGrow: 1 }}>
                    {label}
                </Text>
                <Text>{value}</Text>
            </Group>
        </Tooltip>
    );
};
