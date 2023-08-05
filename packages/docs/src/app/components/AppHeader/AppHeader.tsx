"use client";

import { Group, Burger, AppShell } from "@mantine/core";
import AppHeaderLogo from "./AppHeaderLogo/AppHeaderLogo";
import AppHeaderSearch from "./AppHeaderSearch/AppHeaderSearch";
import AppHeaderButtons from "./AppHeaderButtons/AppHeaderButtons";
import { useAppStore } from "@store";
import { toggleMobileNavbar } from "@store/actions/navbar/toggleMobileNavbar";

export const APPHEADER_HEIGHT = 60;

const AppHeader = () => {
    const mobileNavbarOpened = useAppStore((s) => s.navbar.mobileNavbarOpened);

    return (
        <>
            <AppShell.Header h={APPHEADER_HEIGHT} visibleFrom="sm">
                <Group
                    justify="space-between"
                    h="100%"
                    mx="md"
                    wrap="nowrap"
                    grow
                >
                    <AppHeaderLogo />
                    <AppHeaderSearch />
                    <AppHeaderButtons />
                </Group>
            </AppShell.Header>

            <AppShell.Header h={APPHEADER_HEIGHT} hiddenFrom="sm">
                <Group
                    justify="space-between"
                    h="100%"
                    mx="md"
                    wrap="nowrap"
                    grow
                >
                    <Burger
                        opened={mobileNavbarOpened}
                        onClick={() => toggleMobileNavbar()}
                    />
                    <AppHeaderLogo />
                    <AppHeaderButtons />
                </Group>
            </AppShell.Header>
        </>
    );
};

export default AppHeader;
