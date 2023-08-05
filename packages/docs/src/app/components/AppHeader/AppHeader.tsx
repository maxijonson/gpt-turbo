"use client";

import cx from "clsx";
import { Group, Burger, AppShell, RemoveScroll } from "@mantine/core";
import AppHeaderLogo from "./AppHeaderLogo/AppHeaderLogo";
import AppHeaderSearch from "./AppHeaderSearch/AppHeaderSearch";
import AppHeaderButtons from "./AppHeaderButtons/AppHeaderButtons";
import { useAppStore } from "@store";
import { toggleMobileNavbar } from "@store/actions/navbar/toggleMobileNavbar";
import { APPHEADER_HEIGHT } from "@config/constants";
import * as classes from "./AppHeader.css";

const AppHeader = () => {
    const mobileNavbarOpened = useAppStore((s) => s.navbar.mobileNavbarOpened);

    return (
        <>
            <AppShell.Header
                h={APPHEADER_HEIGHT}
                visibleFrom="sm"
                className={cx(RemoveScroll.classNames.fullWidth, classes.root)}
            >
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
