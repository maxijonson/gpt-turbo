import { Divider, Stack } from "@mantine/core";
import AppSettingsDangerZone from "./AppSettingsDangerZone";
import AppStorageUsage from "./AppStorageUsage";

const DataSettings = () => {
    return (
        <Stack>
            <AppStorageUsage />

            <Divider label="Danger Zone" labelPosition="center" color="red" />

            <AppSettingsDangerZone />
        </Stack>
    );
};

export default DataSettings;
