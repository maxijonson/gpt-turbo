import GPTTurboLogo from "@components/GPTTurboLogo/GPTTurboLogo";
import { Box, Group } from "@mantine/core";
import Link from "next/link";

const AppHeaderLogo = () => {
    return (
        <Group h="100%" w="100%">
            <Box component={Link} href="/" h="50%">
                <GPTTurboLogo />
            </Box>
        </Group>
    );
};

export default AppHeaderLogo;
