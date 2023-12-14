import "@mantine/core/styles.css";
import "@mantine/spotlight/styles.css";
import "@mantine/code-highlight/styles.css";
import { Analytics } from "@vercel/analytics/react";
import { ColorSchemeScript } from "@mantine/core";
import Shell from "./components/Shell/Shell";
import DocsSpotlight from "./components/DocsSpotlight/DocsSpotlight";
import { Metadata } from "next";
import Providers from "./components/Providers/Providers";

const title = "GPT Turbo";
const description =
    "JavaScript library for OpenAI's Chat Completion API. Features conversation history management, parameter configuration, callable functions and plugin support!";
export const metadata: Metadata = {
    title,
    description,
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
        "gpt-5",
        "completion",
        "chatcompletion",
        "conversation",
        "conversation ai",
        "ai",
        "ml",
        "bot",
        "chatbot",
    ],

    openGraph: {
        type: "website",
        title,
        description,
        locale: "en_US",
        url: "https://gpt-turbo.chintristan.io/",
        siteName: "GPT Turbo",
    },
};

interface AppLayoutProps {
    children: React.ReactNode;
}

const AppLayout = (children: AppLayoutProps) => {
    return (
        <html lang="en">
            <head>
                <ColorSchemeScript />
            </head>
            <body>
                <Providers>
                    <DocsSpotlight />
                    <Shell>{children}</Shell>
                </Providers>
                <Analytics />
            </body>
        </html>
    );
};

export default AppLayout;
