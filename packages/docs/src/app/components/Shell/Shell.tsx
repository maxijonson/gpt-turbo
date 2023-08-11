"use client";

import { AppShell } from "@mantine/core";
import ShellHeader from "./ShellHeader/ShellHeader";
import ShellNavbar from "./ShellNavbar/ShellNavbar";
import { useAppStore } from "@store";
import {
    MDX_ROOT_ID,
    SHELLASIDE_WIDTH,
    SHELLHEADER_HEIGHT,
    SHELLNAVBAR_WIDTH,
} from "@config/constants";
import { usePathname } from "next/navigation";
import React from "react";
import ShellAside from "./ShellAside/ShellAside";

interface ShellProps {
    children: React.ReactNode;
}

const EXCLUDE_NAVBAR_PAGES = ["/"];

const getMdxRoot = () => {
    if (typeof document === "undefined") return null;
    return document.getElementById(MDX_ROOT_ID);
};

const Shell = ({ children }: ShellProps) => {
    const pathname = usePathname();
    const [mobileNavbarOpened] = useAppStore((s) => [
        s.navbar.mobileNavbarOpened,
    ]);

    const [mdxRoot, setMdxRoot] = React.useState(getMdxRoot());
    React.useEffect(() => {
        setMdxRoot(getMdxRoot());
    }, [pathname]);

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
            aside={{
                width: SHELLASIDE_WIDTH,
                breakpoint: "lg",
                collapsed: {
                    desktop: mdxRoot === null,
                    mobile: true,
                },
            }}
            transitionDuration={0}
        >
            <ShellHeader />
            <ShellNavbar />
            <ShellAside />

            <AppShell.Main>{children}</AppShell.Main>
        </AppShell>
    );
};

export default Shell;
