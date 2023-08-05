import "@mantine/core/styles.css";
import "@mantine/spotlight/styles.css";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { theme } from "@theme";
import Shell from "./components/Shell/Shell";
import DocsSpotlight from "./components/DocsSpotlight/DocsSpotlight";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "GPT Turbo",
    description:
        "JavaScript library for OpenAI's Chat Completion API. Comes with conversation history management, parameter configuration, callable functions and plugin support!",
    keywords: [
        "openai",
        "chatgpt",
        "chat",
        "gpt",
        "gpt3",
        "gpt-3",
        "gpt3.5",
        "gpt-3.5",
        "gpt4",
        "gpt-4",
        "completion",
        "chatcompletion",
        "conversation",
        "conversation ai",
        "ai",
        "ml",
        "bot",
        "chatbot",
    ],
};

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
