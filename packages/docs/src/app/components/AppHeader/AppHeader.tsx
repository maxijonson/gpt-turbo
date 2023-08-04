import { Group, Box } from "@mantine/core";
import AppHeaderLogo from "./AppHeaderLogo";
import AppHeaderSearch from "./AppHeaderSearch";
import AppHeaderSocials from "./AppHeaderSocials";

const AppHeader = () => {
    return (
        <Box h={60}>
            <Group justify="space-between" h="100%" mx="sm" wrap="nowrap" grow>
                <AppHeaderLogo />
                <AppHeaderSearch />
                <AppHeaderSocials />
            </Group>
        </Box>
    );
};

export default AppHeader;
