import { AppShell, LoadingOverlay } from "@mantine/core";
import AppNavbar from "./AppNavbar";
import ConversationPage from "../pages/ConversationPage";
import useSettings from "../hooks/useSettings";
import usePersistence from "../hooks/usePersistence";

export default () => {
    const { areSettingsLoaded } = useSettings();
    const { isLoading: isLoadingPersistence, hasInit: hasInitPersistence } =
        usePersistence();

    if (!areSettingsLoaded || isLoadingPersistence || !hasInitPersistence) {
        return <LoadingOverlay visible />;
    }

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
            <ConversationPage />
        </AppShell>
    );
};
