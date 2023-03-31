import { AppShell } from "@mantine/core";
import AppNavbar from "./AppNavbar";
import ConversationPage from "../pages/ConversationPage";

export default () => {
    return (
        <AppShell
            padding="md"
            navbar={<AppNavbar />}
            sx={(theme) => ({
                backgroundColor:
                    theme.colorScheme === "dark"
                        ? theme.colors.dark[8]
                        : theme.colors.gray[1],
            })}
        >
            <ConversationPage />
        </AppShell>
    );
};
