import {
    Box,
    ColorSwatch,
    Group,
    Progress,
    Text,
    Tooltip,
    useMantineTheme,
} from "@mantine/core";
import React from "react";
import { STORAGE_PERSISTENCE_KEY } from "../../config/constants";

interface StorageUsage {
    label: string;
    size: number;
}

const MIN_SIZE = 100;
const QUOTA = 5 * 1024 * 1024; // Assuming 5MB, since that's the default for most browsers

const getUsageLabel = (key: string) => {
    const words = key.split(/(?=[A-Z])/);
    return words.map((word) => word[0].toUpperCase() + word.slice(1)).join(" ");
};

const getSizeLabel = (size: number) => {
    if (size < 1024) return `${size.toFixed(2)}B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)}KB`;
    return `${(size / (1024 * 1024)).toFixed(2)}MB`;
};

const AppStorageUsage = () => {
    const storageValue = localStorage.getItem(STORAGE_PERSISTENCE_KEY);

    const theme = useMantineTheme();
    const isDark = theme.colorScheme === "dark";
    const colorShade = isDark ? 4 : 6;

    const usage = React.useMemo(() => {
        if (!storageValue) return [];

        const json = JSON.parse(storageValue);
        if (!json.state) return [];

        const { state } = json;

        return Object.entries(state)
            .map(([key, value]) => {
                const label = getUsageLabel(key);
                const size = JSON.stringify(value).length;

                return {
                    label,
                    size,
                } satisfies StorageUsage;
            })
            .filter((usage) => usage.size > MIN_SIZE);
    }, [storageValue]);

    const colors = React.useMemo(
        () => [
            theme.colors.blue[colorShade],
            theme.colors.grape[colorShade],
            theme.colors.teal[colorShade],
            theme.colors.orange[colorShade],
            theme.colors.indigo[colorShade],
            theme.colors.red[colorShade],
            theme.colors.yellow[colorShade],
            theme.colors.cyan[colorShade],
            theme.colors.lime[colorShade],
            theme.colors.violet[colorShade],
            theme.colors.pink[colorShade],
        ],
        [
            colorShade,
            theme.colors.blue,
            theme.colors.cyan,
            theme.colors.grape,
            theme.colors.indigo,
            theme.colors.lime,
            theme.colors.orange,
            theme.colors.pink,
            theme.colors.red,
            theme.colors.teal,
            theme.colors.violet,
            theme.colors.yellow,
        ]
    );

    const sections = React.useMemo(() => {
        const total = usage.reduce((acc, { size }) => acc + size, 0);

        return usage
            .map(({ label, size }, i) => {
                const color = colors[i % colors.length];

                return {
                    value: (size / QUOTA) * 100,
                    color,
                    label,
                    tooltip: `${label} - ${getSizeLabel(size)}`,
                };
            })
            .concat({
                value: ((QUOTA - total) / QUOTA) * 100,
                color: theme.colors.dark[2],
                label: "Available",
                tooltip: `Available - ${getSizeLabel(QUOTA - total)}`,
            });
    }, [colors, theme.colors.dark, usage]);

    return (
        <Box>
            <Text>Storage Usage</Text>
            <Text size="xs" color="dimmed" mb={0}>
                This is an estimate, assuming a {getSizeLabel(QUOTA)} quota.
                (default for most browsers)
            </Text>
            <Text size="xs" color="dimmed" mb="xs">
                Categories under {getSizeLabel(MIN_SIZE)} are not shown.
            </Text>
            <Progress radius="xl" size="xl" sections={sections} />
            <Group position="center" mt="xs">
                {sections.map(({ color, label, tooltip, value }) => (
                    <Tooltip
                        label={`${tooltip} - ${value.toFixed(2)}%`}
                        key={label}
                        withArrow
                        position="bottom"
                    >
                        <Group noWrap>
                            <ColorSwatch color={color} size={14} />
                            <Text size={11} color="dimmed">
                                {label}
                            </Text>
                        </Group>
                    </Tooltip>
                ))}
            </Group>
        </Box>
    );
};

export default AppStorageUsage;
