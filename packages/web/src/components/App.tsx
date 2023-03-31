import { AppShell, LoadingOverlay } from "@mantine/core";
import AppNavbar from "./AppNavbar";
import ConversationPage from "../pages/ConversationPage";
import useSettings from "../hooks/useSettings";

export default () => {
    const { areSettingsLoaded } = useSettings();

    if (!areSettingsLoaded) {
        return <LoadingOverlay visible />;
    }

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
