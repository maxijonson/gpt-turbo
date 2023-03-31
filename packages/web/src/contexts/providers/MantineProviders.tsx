import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";

interface MantineProvidersProps {
    children?: React.ReactNode;
}

export default ({ children }: MantineProvidersProps) => {
    return (
        <MantineProvider withGlobalStyles withNormalizeCSS>
            <Notifications />
            <ModalsProvider>{children}</ModalsProvider>
        </MantineProvider>
    );
};
