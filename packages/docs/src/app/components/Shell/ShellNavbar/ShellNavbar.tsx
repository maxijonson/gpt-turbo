import {
    Anchor,
    AppShell,
    Box,
    Stack,
    Tabs,
    TabsList,
    TabsTab,
} from "@mantine/core";
import * as classes from "./ShellNavbar.css";
import useDocs from "@contexts/hooks/useDocs";
import { usePathname, useRouter } from "next/navigation";
import sortDocs from "../../../../utils/sortDocs";
import Link from "next/link";

const ShellNavbar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { groupedDocs, docGroupIndexes } = useDocs();

    return (
        <AppShell.Navbar className={classes.root} p="md">
            <Stack>
                {docGroupIndexes.map((group) => {
                    const docs = sortDocs(
                        Object.values(groupedDocs[group.slugGroup])
                    );

                    return (
                        <Box key={group.slug}>
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
                                                router.push(`/docs/${doc.slug}`)
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
        </AppShell.Navbar>
    );
};

export default ShellNavbar;
