import { Box } from "@mantine/core";
import { Metadata } from "next";
import HomeHero from "./components/HomeHero/HomeHero";

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
    viewport: "width=device-width, initial-scale=1.0",
};

const HomePage = () => {
    return (
        <Box>
            <HomeHero />
        </Box>
    );
};

export default HomePage;
