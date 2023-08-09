import { AppShell, Box, Button, Text } from "@mantine/core";
import * as classes from "./ShellNavbar.css";
import useDocs from "@contexts/hooks/useDocs";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ShellNavbar = () => {
    const pathname = usePathname();
    const { groupedDocs, docGroupIndexes } = useDocs();

    return (
        <AppShell.Navbar className={classes.root} p="md">
            {docGroupIndexes.map((group) => (
                <Box key={group.slug}>
                    <Text fw="bold" px="md" mb={4}>
                        {group.title}
                    </Text>
                    {Object.values(groupedDocs[group.slugGroup]).map((doc) => {
                        const path = `/docs/${doc.slug}`;
                        const isActive = pathname === path;

                        return (
                            <Button
                                key={doc.slug}
                                component={Link}
                                href={path}
                                fullWidth
                                justify="start"
                                variant={isActive ? "light" : "default"}
                                fw={isActive ? "normal" : "lighter"}
                                style={{ border: 0 }}
                            >
                                {doc.title}
                            </Button>
                        );
                    })}
                </Box>
            ))}
        </AppShell.Navbar>
    );
};

export default ShellNavbar;
