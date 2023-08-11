"use client";

import { AppShell } from "@mantine/core";
import ShellHeader from "./ShellHeader/ShellHeader";
import ShellNavbar from "./ShellNavbar/ShellNavbar";
import { useAppStore } from "@store";
import {
    SHELLASIDE_WIDTH,
    SHELLHEADER_HEIGHT,
    SHELLNAVBAR_WIDTH,
} from "@config/constants";
import { usePathname } from "next/navigation";
import React from "react";
import ShellAside from "./ShellAside/ShellAside";
import useDocs from "@contexts/hooks/useDocs";

interface ShellProps {
    children: React.ReactNode;
}

const EXCLUDE_NAVBAR_PAGES = ["/"];

const Shell = ({ children }: ShellProps) => {
    const pathname = usePathname();
    const [mobileNavbarOpened] = useAppStore((s) => [
        s.navbar.mobileNavbarOpened,
    ]);
    const { docs } = useDocs();

    const currentDoc = React.useMemo(
        () => docs.find((doc) => `/docs/${doc.slug}` === pathname),
        [docs, pathname]
    );
    const showAside =
        !!currentDoc &&
        !currentDoc.isGroupIndex &&
        currentDoc.headings.length > 0;

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
                    desktop: !showAside,
                    mobile: true,
                },
            }}
            transitionDuration={0}
        >
            <ShellHeader />
            <ShellNavbar />
            {showAside && <ShellAside doc={currentDoc} />}

            <AppShell.Main>{children}</AppShell.Main>
        </AppShell>
    );
};

export default Shell;
