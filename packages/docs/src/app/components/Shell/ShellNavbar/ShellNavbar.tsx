import {
    Anchor,
    AppShell,
    Box,
    ScrollArea,
    Stack,
    Tabs,
    TabsList,
    TabsTab,
} from "@mantine/core";
import useDocs from "@contexts/hooks/useDocs";
import { usePathname, useRouter } from "next/navigation";
import sortDocs from "@utils/sortDocs";
import Link from "next/link";
import * as classes from "./ShellNavbar.css";

const ShellNavbar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { groupedDocs, docGroupIndexes } = useDocs();

    return (
        <AppShell.Navbar className={classes.root} py={0}>
            <ScrollArea offsetScrollbars={false}>
                <Stack py="md">
                    {docGroupIndexes.map((group) => {
                        const docs = sortDocs(
                            Object.values(groupedDocs[group.slugGroup])
                        );

                        return (
                            <Box key={group.slug} px="md">
                                <Anchor
                                    component={Link}
                                    href={`/docs/${group.slugGroup}`}
                                    className={classes.groupTitle}
                                    fw="bold"
                                    fz="xs"
                                    c="inherit"
                                    mb={4}
                                >
                                    {group.title}
                                </Anchor>
                                <Tabs
                                    orientation="vertical"
                                    placement="right"
                                    value={pathname}
                                >
                                    <TabsList w="100%">
                                        {docs.map((doc) => (
                                            <TabsTab
                                                key={doc.slug}
                                                value={`/docs/${doc.slug}`}
                                                onClick={() =>
                                                    router.push(
                                                        `/docs/${doc.slug}`
                                                    )
                                                }
                                                classNames={{
                                                    tab: classes.tab,
                                                }}
                                            >
                                                {doc.title}
                                            </TabsTab>
                                        ))}
                                    </TabsList>
                                </Tabs>
                            </Box>
                        );
                    })}
                </Stack>
            </ScrollArea>
        </AppShell.Navbar>
    );
};

export default ShellNavbar;
