"use client";

import { MantineProvider } from "@mantine/core";

interface ClientProvidersProps {
    children: React.ReactNode;
}

const ClientProviders = ({ children }: ClientProvidersProps) => {
    return (
        <MantineProvider withGlobalStyles withNormalizeCSS>
            {children}
        </MantineProvider>
    );
};

export default ClientProviders;
