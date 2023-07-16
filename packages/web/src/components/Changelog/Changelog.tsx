import {
    Box,
    Button,
    Center,
    List,
    Stack,
    Text,
    Timeline,
    Title,
} from "@mantine/core";
import { changelog } from "../../changelog";
import { BsGithub } from "react-icons/bs";

const dateStr = (date: Date) => {
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

const Changelog = () => {
    return (
        <Box mt="xs">
            <Timeline>
                {changelog.map(
                    ({ version, date, sections, description }, i) => (
                        <Timeline.Item
                            key={version}
                            title={`v${version}`}
                            bulletSize={i === 0 ? 24 : 16}
                            active
                        >
                            <Text color="dimmed" size="xs">
                                {dateStr(date)}
                            </Text>
                            {description && (
                                <Text mt="xs" size="sm">
                                    {description}
                                </Text>
                            )}
                            <Stack spacing="xs" mt="xs">
                                {sections.map(
                                    ({ label, items, description }, j) => (
                                        <Box key={j}>
                                            <Title order={5}>{label}</Title>
                                            {description && (
                                                <Text mt="xs" size="sm">
                                                    {description}
                                                </Text>
                                            )}
                                            <List withPadding pr="xl">
                                                {items.map((item, k) => (
                                                    <List.Item key={k}>
                                                        {item}
                                                    </List.Item>
                                                ))}
                                            </List>
                                        </Box>
                                    )
                                )}
                            </Stack>
                        </Timeline.Item>
                    )
                )}
                <Timeline.Item
                    active
                    title="<v4.4.0 - End of Changelog"
                    bulletSize={16}
                >
                    Changes before this point were not recorded. Please refer to
                    the repository's commit history if you really need to know!
                    <Center mt="xs">
                        <Button
                            component="a"
                            href="https://github.com/maxijonson/gpt-turbo/commits/develop?until=2023-07-07&branch=develop&path%5B%5D=packages&path%5B%5D=web&qualified_name=refs%2Fheads%2Fdevelop"
                            target="_blank"
                            leftIcon={<BsGithub />}
                            color="dark"
                        >
                            View older changes on GitHub
                        </Button>
                    </Center>
                </Timeline.Item>
            </Timeline>
        </Box>
    );
};

export default Changelog;
