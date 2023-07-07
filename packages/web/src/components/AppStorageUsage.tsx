import React from "react";
import {
    STORAGEKEY_PERSISTENCE,
    STORAGEKEY_SETTINGS,
    STORAGEKEY_COLORSCHEME,
    STORAGEKEY_SHOWUSAGE,
} from "../config/constants";
import { useLocalStorage } from "@mantine/hooks";
import {
    Box,
    ColorSwatch,
    Group,
    Progress,
    Text,
    Tooltip,
    useMantineTheme,
} from "@mantine/core";

const getSizeLabel = (size: number) => {
    if (size < 1024) return `${size.toFixed(2)}B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)}KB`;
    return `${(size / (1024 * 1024)).toFixed(2)}MB`;
};

const useLocalStorageSize = (key: string) => {
    const [value] = useLocalStorage({ key, deserialize: (v) => v });
    return value ? key.length + value.length : 0;
};

const AppStorageUsage = () => {
    const theme = useMantineTheme();
    const persistenceSize = useLocalStorageSize(STORAGEKEY_PERSISTENCE);
    const settingsSize = useLocalStorageSize(STORAGEKEY_SETTINGS);
    const colorSchemeSize = useLocalStorageSize(STORAGEKEY_COLORSCHEME);
    const showUsageSize = useLocalStorageSize(STORAGEKEY_SHOWUSAGE);

    const usage = React.useMemo(
        () =>
            [
                {
                    key: STORAGEKEY_PERSISTENCE,
                    label: "Persistence",
                    size: persistenceSize,
                },
                {
                    key: STORAGEKEY_SETTINGS,
                    label: "Settings",
                    size: settingsSize,
                },
                {
                    key: STORAGEKEY_COLORSCHEME,
                    label: "Color Scheme",
                    size: colorSchemeSize,
                },
                {
                    key: STORAGEKEY_SHOWUSAGE,
                    label: "Show Usage",
                    size: showUsageSize,
                },
            ].filter(({ size }) => size > 0),
        [colorSchemeSize, persistenceSize, settingsSize, showUsageSize]
    );

    const colors: Record<string, string> = React.useMemo(
        () => ({
            [STORAGEKEY_PERSISTENCE]: theme.colors.pink[5],
            [STORAGEKEY_SETTINGS]: theme.colors.blue[5],
            [STORAGEKEY_COLORSCHEME]: theme.colors.green[5],
            [STORAGEKEY_SHOWUSAGE]: theme.colors.yellow[5],
        }),
        [
            theme.colors.blue,
            theme.colors.green,
            theme.colors.pink,
            theme.colors.yellow,
        ]
    );

    const sections = React.useMemo(() => {
        const quota = 5 * 1024 * 1024; // Assuming 5MB, since that's the default for most browsers
        const total = usage.reduce((acc, { size }) => acc + size, 0);

        return usage
            .map(({ key, label, size }) => {
                const color = colors[key] ?? theme.colors.dark[7];

                return {
                    value: (size / quota) * 100,
                    color,
                    label,
                    tooltip: `${label} - ${getSizeLabel(size)}`,
                };
            })
            .concat({
                value: ((quota - total) / quota) * 100,
                color: theme.colors.dark[2],
                label: "Available",
                tooltip: `Available - ${getSizeLabel(quota - total)}`,
            });
    }, [colors, theme.colors.dark, usage]);

    return (
        <Box>
            <Text>Storage Usage</Text>
            <Text size="xs" color="dimmed" mb="xs">
                This is an estimate, assuming a 5MB quota. (default for most
                browsers)
            </Text>
            <Progress radius="xl" size="xl" sections={sections} />
            <Group position="apart" mt="xs">
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
