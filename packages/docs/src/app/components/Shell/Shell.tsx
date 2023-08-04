"use client";

import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import AppHeader, { APPHEADER_HEIGHT } from "../AppHeader/AppHeader";
import AppNavbar, { APPNAVBAR_WIDTH } from "../AppNavbar/AppNavbar";

interface ShellProps {
    children: React.ReactNode;
}

const Shell = ({ children }: ShellProps) => {
    const [navbarOpened, { toggle: toggleNavbar }] = useDisclosure();

    return (
        <AppShell
            header={{ height: APPHEADER_HEIGHT }}
            navbar={{
                width: APPNAVBAR_WIDTH,
                breakpoint: "sm",
                collapsed: { desktop: true, mobile: !navbarOpened },
            }}
            transitionDuration={0}
        >
            <AppHeader
                navbarOpened={navbarOpened}
                toggleNavbar={toggleNavbar}
            />
            <AppNavbar />

            <AppShell.Main>{children}</AppShell.Main>
        </AppShell>
    );
};

export default Shell;
