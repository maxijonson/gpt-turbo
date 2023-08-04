import { Group, Box } from "@mantine/core";
import AppHeaderLogo from "./AppHeaderLogo";
import AppHeaderSearch from "./AppHeaderSearch";
import AppHeaderButtons from "./AppHeaderButtons";

const AppHeader = () => {
    return (
        <Box h={60}>
            <Group justify="space-between" h="100%" mx="sm" wrap="nowrap" grow>
                <AppHeaderLogo />
                <AppHeaderSearch />
                <AppHeaderButtons />
            </Group>
        </Box>
    );
};

export default AppHeader;
