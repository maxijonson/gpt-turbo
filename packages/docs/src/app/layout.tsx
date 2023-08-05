import "@mantine/core/styles.css";
import "@mantine/spotlight/styles.css";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { theme } from "@theme";
import Shell from "./components/Shell/Shell";
import DocsSpotlight from "./components/DocsSpotlight/DocsSpotlight";

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
                    <DocsSpotlight />
                    <Shell>{children}</Shell>
                </MantineProvider>
            </body>
        </html>
    );
};

export default AppLayout;
