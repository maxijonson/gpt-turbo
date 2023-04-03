import {
    ColorScheme,
    ColorSchemeProvider,
    MantineProvider,
} from "@mantine/core";
import { useColorScheme, useLocalStorage } from "@mantine/hooks";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import React from "react";

interface MantineProvidersProps {
    children?: React.ReactNode;
}

export default ({ children }: MantineProvidersProps) => {
    const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
        key: "gpt-turbo-colorscheme",
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
                theme={{ colorScheme }}
                withGlobalStyles
                withNormalizeCSS
            >
                <Notifications />
                <ModalsProvider>{children}</ModalsProvider>
            </MantineProvider>
        </ColorSchemeProvider>
    );
};
