import { AppShell, Box, Tabs, TabsList, TabsTab, Text } from "@mantine/core";
import * as classes from "./ShellNavbar.css";
import useDocs from "@contexts/hooks/useDocs";
import { usePathname, useRouter } from "next/navigation";
import sortDocs from "../../../../utils/sortDocs";

const ShellNavbar = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { groupedDocs, docGroupIndexes } = useDocs();

    return (
        <AppShell.Navbar className={classes.root} p="md">
            {docGroupIndexes.map((group) => {
                const docs = sortDocs(
                    Object.values(groupedDocs[group.slugGroup])
                );

                return (
                    <Box key={group.slug}>
                        <Text
                            className={classes.groupTitle}
                            fw="bold"
                            fz="xs"
                            mb={4}
                        >
                            {group.title}
                        </Text>
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
        </AppShell.Navbar>
    );
};

export default ShellNavbar;
