import "@mantine/core/styles.css";
import AppHeader from "./components/AppHeader/AppHeader";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { theme } from "../utils/theme";

interface AppLayoutProps {
    children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
    return (
        <html lang="en">
            <head>
                <ColorSchemeScript />
            </head>
            <body>
                <MantineProvider theme={theme}>
                    <AppHeader />
                    {children}
                </MantineProvider>
            </body>
        </html>
    );
};

export default AppLayout;
