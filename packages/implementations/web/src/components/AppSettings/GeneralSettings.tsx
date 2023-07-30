import {
    ColorScheme,
    Group,
    SegmentedControl,
    Stack,
    Switch,
    Text,
    useMantineColorScheme,
} from "@mantine/core";
import { useAppStore } from "../../store";
import { toggleShowUsage } from "../../store/actions/appSettings/toggleShowUsage";
import { shallow } from "zustand/shallow";
import { toggleShowConversationImport } from "../../store/actions/appSettings/toggleShowConversationImport";

const GeneralSettings = () => {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const [showUsage, showConversationImport] = useAppStore(
        (state) => [state.showUsage, state.showConversationImport],
        shallow
    );

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
                <Text>Show Conversation Usage</Text>
                <Switch
                    checked={showUsage}
                    onChange={() => toggleShowUsage()}
                />
            </Group>

            <Group position="apart" noWrap>
                <Stack spacing={0}>
                    <Text>Show Conversation Import</Text>
                    <Text size="xs" color="dimmed">
                        You can also import conversations by dropping them onto
                        the navbar.
                    </Text>
                </Stack>
                <Switch
                    checked={showConversationImport}
                    onChange={() => toggleShowConversationImport()}
                />
            </Group>
        </Stack>
    );
};

export default GeneralSettings;
