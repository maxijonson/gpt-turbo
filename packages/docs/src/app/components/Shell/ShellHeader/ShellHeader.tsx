"use client";

import cx from "clsx";
import { Group, Burger, AppShell, RemoveScroll } from "@mantine/core";
import ShellHeaderLogo from "./ShellHeaderLogo/ShellHeaderLogo";
import ShellHeaderSearch from "./ShellHeaderSearch/ShellHeaderSearch";
import ShellHeaderButtons from "./ShellHeaderButtons/ShellHeaderButtons";
import { useAppStore } from "@store";
import { toggleMobileNavbar } from "@store/actions/navbar/toggleMobileNavbar";
import { SHELLHEADER_HEIGHT } from "@config/constants";
import * as classes from "./ShellHeader.css";

const ShellHeader = () => {
    const mobileNavbarOpened = useAppStore((s) => s.navbar.mobileNavbarOpened);

    return (
        <>
            <AppShell.Header
                h={SHELLHEADER_HEIGHT}
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
                    <ShellHeaderLogo />
                    <ShellHeaderSearch />
                    <ShellHeaderButtons />
                </Group>
            </AppShell.Header>

            <AppShell.Header h={SHELLHEADER_HEIGHT} hiddenFrom="sm">
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
                    <ShellHeaderLogo />
                    <ShellHeaderButtons />
                </Group>
            </AppShell.Header>
        </>
    );
};

export default ShellHeader;
