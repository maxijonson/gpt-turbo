import GPTTurboLogo from "@components/GPTTurboLogo/GPTTurboLogo";
import { Box, Group } from "@mantine/core";

const AppHeaderLogo = () => {
    return (
        <Group h="100%" w="100%">
            <Box h="50%">
                <GPTTurboLogo />
            </Box>
        </Group>
    );
};

export default AppHeaderLogo;
