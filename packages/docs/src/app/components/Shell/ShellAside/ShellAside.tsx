import {
    AppShellAside,
    Tabs,
    TabsList,
    TabsTab,
    Text,
    rem,
} from "@mantine/core";
import React from "react";
import { PartialDoc } from "@mdx/docs";
import { SHELLASIDE_WIDTH } from "../../../../config/constants";
import * as classes from "./ShellAside.css";
import { useRouter } from "next/navigation";

interface ShellAsideProps {
    doc: PartialDoc;
}

const ShellAside = ({ doc }: ShellAsideProps) => {
    const router = useRouter();
    const { headings } = doc;

    const minHeading = headings.reduce((max, curr) => {
        if (curr.level < max) return curr.level;
        return max;
    }, headings[0].level);

    return (
        <AppShellAside withBorder={false} py="xl">
            <Text fw="bold" fz="xs">
                ON THIS PAGE
            </Text>
            <Tabs
                placement="right"
                orientation="vertical"
                mt="md"
                defaultValue={headings[0].hash}
            >
                <TabsList>
                    {headings.map((heading) => (
                        <TabsTab
                            key={heading.hash}
                            value={heading.hash}
                            onClick={() => router.push(`#${heading.hash}`)}
                            w={SHELLASIDE_WIDTH}
                            classNames={{
                                tabLabel: classes.tabLabel,
                            }}
                            pl={rem(8 + (heading.level - minHeading) * 10)}
                        >
                            {heading.title}
                        </TabsTab>
                    ))}
                </TabsList>
            </Tabs>
        </AppShellAside>
    );
};

export default ShellAside;
