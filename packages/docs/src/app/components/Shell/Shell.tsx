"use client";

import { AppShell } from "@mantine/core";
import AppHeader from "../AppHeader/AppHeader";
import AppNavbar, { APPNAVBAR_WIDTH } from "../AppNavbar/AppNavbar";
import { useAppStore } from "@store";
import { APPHEADER_HEIGHT } from "@config/constants";
import { usePathname } from "next/navigation";
import { setShowDesktopNavbar } from "../../../store/actions/navbar/setShowDesktopNavbar";
import React from "react";

interface ShellProps {
    children: React.ReactNode;
}

const EXCLUDE_NAVBAR_PAGES = ["/"];

const Shell = ({ children }: ShellProps) => {
    const pathname = usePathname();
    const [mobileNavbarOpened, showDesktopNavbar] = useAppStore((s) => [
        s.navbar.mobileNavbarOpened,
        s.navbar.showDesktopNavbar,
    ]);

    React.useEffect(() => {
        setShowDesktopNavbar(!EXCLUDE_NAVBAR_PAGES.includes(pathname));
    }, [pathname]);

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
