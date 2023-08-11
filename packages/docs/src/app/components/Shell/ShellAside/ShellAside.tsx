import {
    AppShellAside,
    RemoveScroll,
    Tabs,
    TabsList,
    TabsTab,
    Text,
    rem,
} from "@mantine/core";
import React from "react";
import { SHELLASIDE_WIDTH } from "@config/constants";
import * as classes from "./ShellAside.css";
import { usePathname, useRouter } from "next/navigation";
import getTocEntries, { TOCEntry } from "@utils/getTocEntries";

const ShellAside = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [tocEntries, setTocEntries] = React.useState<TOCEntry[]>([]);
    const [active, setActive] = React.useState<string | null>(null);

    const minHeading = React.useMemo(() => {
        return Math.min(...tocEntries.map((entry) => entry.level));
    }, [tocEntries]);

    React.useEffect(() => {
        const entries = getTocEntries();
        if (entries.length === 0) return;

        setTocEntries(entries);
        setActive(entries[0].hash);

        const onScroll = () => {
            const closest = entries
                .map((entry) => {
                    const el = document.getElementById(entry.hash);
                    if (!el) return null;

                    const rect = el.getBoundingClientRect();
                    return {
                        hash: entry.hash,
                        top: rect.top,
                    };
                })
                .filter(
                    (entry): entry is { hash: string; top: number } =>
                        entry !== null
                )
                .reduce((prev, curr) => {
                    return Math.abs(curr.top) < Math.abs(prev.top)
                        ? curr
                        : prev;
                }, { hash: "", top: Infinity });

            setActive(closest.hash);
        };

        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, [pathname]);

    if (tocEntries.length === 0 || !active) return null;

    return (
        <AppShellAside withBorder={false} py="xl" className={RemoveScroll.classNames.fullWidth}>
            <Text fw="bold" fz="xs">
                ON THIS PAGE
            </Text>
            <Tabs
                placement="right"
                orientation="vertical"
                mt="md"
                value={active}
            >
                <TabsList>
                    {tocEntries.map((entry) => (
                        <TabsTab
                            key={entry.hash}
                            value={entry.hash}
                            onClick={() => router.push(`#${entry.hash}`)}
                            w={SHELLASIDE_WIDTH}
                            classNames={{
                                tabLabel: classes.tabLabel,
                            }}
                            pl={rem(8 + (entry.level - minHeading) * 10)}
                        >
                            {entry.title}
                        </TabsTab>
                    ))}
                </TabsList>
            </Tabs>
        </AppShellAside>
    );
};

export default ShellAside;
