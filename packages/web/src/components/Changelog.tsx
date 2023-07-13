import { Box, List, Stack, Text, Timeline, Title } from "@mantine/core";
import { changelog } from "../changelog";

const dateStr = (date: Date) => {
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

const Changelog = () => {
    return (
        <Box>
            <Timeline active={0}>
                {changelog.map(({ version, date, sections }, i) => (
                    <Timeline.Item
                        key={version}
                        title={`v${version}`}
                        bulletSize={i === 0 ? 24 : 16}
                    >
                        <Text color="dimmed" size="xs">
                            {dateStr(date)}
                        </Text>
                        <Stack spacing="xs" mt="xs">
                            {sections.map(({ label, items }, j) => (
                                <Box key={j}>
                                    <Title order={5}>{label}</Title>
                                    <List withPadding pr="xl">
                                        {items.map((item, k) => (
                                            <List.Item key={k}>
                                                {item}
                                            </List.Item>
                                        ))}
                                    </List>
                                </Box>
                            ))}
                        </Stack>
                    </Timeline.Item>
                ))}
            </Timeline>
        </Box>
    );
};

export default Changelog;
