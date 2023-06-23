import { AppShell } from "@mantine/core";
import AppNavbar from "./AppNavbar";

interface ConversationPageShellProps {
    children?: React.ReactNode;
}

const ConversationPageShell = ({ children }: ConversationPageShellProps) => {
    return (
        <AppShell
            padding="md"
            navbarOffsetBreakpoint="sm"
            navbar={<AppNavbar />}
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
