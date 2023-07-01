import {
    Button,
    ColorScheme,
    Divider,
    Group,
    SegmentedControl,
    Stack,
    Switch,
    Text,
    useMantineColorScheme,
} from "@mantine/core";
import useConversationManager from "../hooks/useConversationManager";
import React from "react";

const AppSettings = () => {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const { showUsage, setShowUsage, removeAllConversations } =
        useConversationManager();
    const [clearConfirm, setClearConfirm] = React.useState(false);

    const handleClearConversations = React.useCallback(() => {
        if (!clearConfirm) {
            setClearConfirm(true);
            return;
        }
        removeAllConversations();
        setClearConfirm(false);
    }, [clearConfirm, removeAllConversations]);

    return (
        <Stack>
            <Group position="apart" noWrap>
                <Text>Theme</Text>
                <SegmentedControl
                    data={[
                        { label: "Light", value: "light" },
                        { label: "Dark", value: "dark" },
                    ]}
                    value={colorScheme}
                    onChange={(value) =>
                        toggleColorScheme(value as ColorScheme)
                    }
                />
            </Group>

            <Group position="apart" noWrap>
                <Text>Show Usage</Text>
                <Switch
                    checked={showUsage}
                    onChange={() => setShowUsage(!showUsage)}
                />
            </Group>

            <Divider label="Danger Zone" labelPosition="center" color="red" />

            <Group position="apart" noWrap>
                <Text>Delete all conversations</Text>
                <Button
                    color="red"
                    variant={clearConfirm ? undefined : "outline"}
                    onClick={handleClearConversations}
                >
                    {clearConfirm ? "Confirm Delete?" : "Delete"}
                </Button>
            </Group>
        </Stack>
    );
};

export default AppSettings;
