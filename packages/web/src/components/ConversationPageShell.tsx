import { AppShell, useMantineTheme } from "@mantine/core";
import ConversationNavbar from "./ConversationNavbar/ConversationNavbar";
import { useMediaQuery } from "@mantine/hooks";

interface ConversationPageShellProps {
    children?: React.ReactNode;
}

const ConversationPageShell = ({ children }: ConversationPageShellProps) => {
    const theme = useMantineTheme();
    const isSm = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);

    return (
        <AppShell
            padding={isSm ? 0 : "md"}
            navbarOffsetBreakpoint="sm"
            navbar={<ConversationNavbar />}
            sx={(theme) => ({
                backgroundColor:
                    theme.colorScheme === "dark"
                        ? theme.colors.dark[8]
                        : theme.colors.gray[1],
            })}
        >
            {children}
        </AppShell>
    );
};

export default ConversationPageShell;
