import { Anchor, Stack, Text } from "@mantine/core";
import { DISCORD_SERVER_INVITE } from "../config/constants";

const About = () => {
    return (
        <Stack>
            <Text>
                This web app was created in order to showcase what the
                underlying{" "}
                <Anchor
                    href="https://github.com/maxijonson/gpt-turbo"
                    target="_blank"
                >
                    GPT Turbo library
                </Anchor>{" "}
                can do. It is *free, open-source and your data is stored in your
                browser's local storage (mostly because I did not want to invest
                in an infrastructure!).
            </Text>
            <Text>
                The initial goal was to show that GPT Turbo could be used to
                make a ChatGPT clone, with the difference that not only can you
                choose your model, but you can also configure every parameter of
                OpenAI's Chat Completion API, including temperature, top-p,
                frequency penalty, presence penalty, and more.
            </Text>
            <Text>
                Since then, multiple additions were made to make it stand out a
                bit more from ChatGPT, including context/prompt saving, usage
                tracking, and probably the biggest one of all: function calling
                support with code execution, which could be used to build your
                own plugins like in the Pro version of ChatGPT.
            </Text>
            <Text>
                If you enjoy this project, please consider{" "}
                <Anchor
                    href="https://github.com/maxijonson/gpt-turbo"
                    target="_blank"
                >
                    giving it a star on GitHub
                </Anchor>{" "}
                and/or{" "}
                <Anchor href={DISCORD_SERVER_INVITE} target="_blank">
                    joining the Discord server
                </Anchor>
                !
            </Text>
            <Text size="xs">
                *free because you don't need to pay to use this web app, but
                you'll need to use your own OpenAI API key, which is a paid
                service.
            </Text>
        </Stack>
    );
};

export default About;
