import { Box, Group } from "@mantine/core";
import React from "react";
import ThemeSwitch from "./ThemeSwitch";
import RepoButton from "./RepoButton";
import SearchButton from "./SearchButton";
import DiscordButton from "./DiscordButton";

const ShellHeaderButtons = () => {
    return (
        <Group justify="right" gap="xs">
            <ThemeSwitch />

            <Group gap="xs" visibleFrom="sm">
                <DiscordButton />
                <RepoButton />
            </Group>

            <Box hiddenFrom="sm">
                <SearchButton />
            </Box>
        </Group>
    );
};

export default ShellHeaderButtons;
