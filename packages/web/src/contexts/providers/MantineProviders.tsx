import { ColorSchemeProvider, MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import React from "react";
import { toggleColorScheme } from "../../store/actions/appSettings/toggleColorScheme";
import { useAppStore } from "../../store";

interface MantineProvidersProps {
    children?: React.ReactNode;
}

const MantineProviders = ({ children }: MantineProvidersProps) => {
    const colorScheme = useAppStore((state) => state.colorScheme);

    return (
        <ColorSchemeProvider
            colorScheme={colorScheme}
            toggleColorScheme={toggleColorScheme}
        >
            <MantineProvider
                theme={{ colorScheme, loader: "dots" }}
                withGlobalStyles
                withNormalizeCSS
            >
                <Notifications />
                <ModalsProvider>{children}</ModalsProvider>
            </MantineProvider>
        </ColorSchemeProvider>
    );
};

export default MantineProviders;
