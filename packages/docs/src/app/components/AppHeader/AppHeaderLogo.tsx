import { Group, Image } from "@mantine/core";
import NextImage from "next/image";
import logo from "@/../public/assets/images/logo/logo-inline-transparent-dark.png";

const AppHeaderLogo = () => {
    return (
        <Group justify="left" h="100%">
            <Image
                src={logo}
                alt="GPT Turbo Logo"
                component={NextImage}
                w="auto"
                height={30}
                fit="contain"
            />
        </Group>
    );
};

export default AppHeaderLogo;
