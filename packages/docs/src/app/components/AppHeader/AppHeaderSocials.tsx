import { ActionIcon, Group } from "@mantine/core";
import React from "react";
import { BiLogoGithub } from "react-icons/bi";

const AppHeaderSocials = () => {
    return (
        <Group justify="right">
            <ActionIcon size="lg" radius="xl" variant="subtle" color="dark.0">
                <BiLogoGithub size={24} />
            </ActionIcon>
        </Group>
    );
};

export default AppHeaderSocials;
