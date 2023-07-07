import {
    ColorScheme,
    ColorSchemeProvider,
    MantineProvider,
} from "@mantine/core";
import { useColorScheme, useLocalStorage } from "@mantine/hooks";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import React from "react";
import { STORAGEKEY_COLORSCHEME } from "../../config/constants";

interface MantineProvidersProps {
    children?: React.ReactNode;
}

const MantineProviders = ({ children }: MantineProvidersProps) => {
    const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
        key: STORAGEKEY_COLORSCHEME,
        defaultValue: useColorScheme(),
        getInitialValueInEffect: true,
    });
    const toggleColorScheme = (value?: ColorScheme) =>
        setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

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
