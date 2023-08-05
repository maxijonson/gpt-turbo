"use client";

import { AppShell } from "@mantine/core";
import AppHeader, { APPHEADER_HEIGHT } from "../AppHeader/AppHeader";
import AppNavbar, { APPNAVBAR_WIDTH } from "../AppNavbar/AppNavbar";
import { useAppStore } from "@store";

interface ShellProps {
    children: React.ReactNode;
}

const Shell = ({ children }: ShellProps) => {
    const [mobileNavbarOpened, showDesktopNavbar] = useAppStore((s) => [
        s.navbar.mobileNavbarOpened,
        s.navbar.showDesktopNavbar,
    ]);

    return (
        <AppShell
            header={{ height: APPHEADER_HEIGHT }}
            navbar={{
                width: APPNAVBAR_WIDTH,
                breakpoint: "sm",
                collapsed: {
                    desktop: !showDesktopNavbar,
                    mobile: !mobileNavbarOpened,
                },
            }}
            transitionDuration={0}
        >
            <AppHeader />
            <AppNavbar />

            <AppShell.Main>{children}</AppShell.Main>
        </AppShell>
    );
};

export default Shell;
