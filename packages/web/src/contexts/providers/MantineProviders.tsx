import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";

interface MantineProvidersProps {
    children?: React.ReactNode;
}

export default ({ children }: MantineProvidersProps) => {
    return (
        <MantineProvider withGlobalStyles withNormalizeCSS>
            <ModalsProvider>{children}</ModalsProvider>
        </MantineProvider>
    );
};
