"use client";

import { AppShell } from "@mantine/core";
import ShellHeader from "./ShellHeader/ShellHeader";
import ShellNavbar, { SHELLNAVBAR_WIDTH } from "./ShellNavbar/ShellNavbar";
import { useAppStore } from "@store";
import { SHELLHEADER_HEIGHT } from "@config/constants";
import { usePathname } from "next/navigation";
import React from "react";

interface ShellProps {
    children: React.ReactNode;
}

const EXCLUDE_NAVBAR_PAGES = ["/"];

const Shell = ({ children }: ShellProps) => {
    const pathname = usePathname();
    const [mobileNavbarOpened] = useAppStore((s) => [
        s.navbar.mobileNavbarOpened,
    ]);

    return (
        <AppShell
            header={{ height: SHELLHEADER_HEIGHT }}
            navbar={{
                width: SHELLNAVBAR_WIDTH,
                breakpoint: "sm",
                collapsed: {
                    desktop: EXCLUDE_NAVBAR_PAGES.includes(pathname),
                    mobile: !mobileNavbarOpened,
                },
            }}
            transitionDuration={0}
        >
            <ShellHeader />
            <ShellNavbar />

            <AppShell.Main>{children}</AppShell.Main>
        </AppShell>
    );
};

export default Shell;
