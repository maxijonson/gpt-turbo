import {
    ColorScheme,
    Divider,
    Group,
    SegmentedControl,
    Stack,
    Switch,
    Text,
    useMantineColorScheme,
} from "@mantine/core";
import AppStorageUsage from "./AppStorageUsage";
import { useAppStore } from "../../store";
import { toggleShowUsage } from "../../store/actions/appSettings/toggleShowUsage";
import AppSettingsDangerZone from "./AppSettingsDangerZone";

const AppSettings = () => {
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const showUsage = useAppStore((state) => state.showUsage);

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
                    onChange={() => toggleShowUsage()}
                />
            </Group>

            <AppStorageUsage />

            <Divider label="Danger Zone" labelPosition="center" color="red" />

            <AppSettingsDangerZone />
        </Stack>
    );
};

export default AppSettings;
