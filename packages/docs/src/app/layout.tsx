import "@mantine/core/styles.css";
import AppHeader from "./components/AppHeader/AppHeader";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";

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
                <MantineProvider>
                    <AppHeader />
                    {children}
                </MantineProvider>
            </body>
        </html>
    );
};

export default AppLayout;
