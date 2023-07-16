import { Stack, Group, Anchor, Text } from "@mantine/core";
import { BsGithub, BsDiscord } from "react-icons/bs";
import { DISCORD_SERVER_INVITE } from "../../../config/constants";
import AboutButton from "../../About/AboutButton";
import ChangelogButton from "../../Changelog/ChangelogButton";
import TippedActionIcon from "../../common/TippedActionIcon";

const ConversationNavbarFooter = () => {
    return (
        <Stack spacing={0} p={0}>
            <Group position="center">
                <TippedActionIcon
                    component="a"
                    tip="View source code"
                    href="https://github.com/maxijonson/gpt-turbo/tree/develop/packages/web"
                    size="xs"
                >
                    <BsGithub />
                </TippedActionIcon>
                <TippedActionIcon
                    component="a"
                    href={DISCORD_SERVER_INVITE}
                    target="_blank"
                    tip="Join Discord server"
                    size="xs"
                >
                    <BsDiscord />
                </TippedActionIcon>
                <AboutButton />
                <ChangelogButton />
            </Group>
            <Text align="center" size="xs">
                GPT Turbo Web v{APP_VERSION} by{" "}
                <Anchor href="https://github.com/maxijonson">
                    Tristan Chin
                </Anchor>
            </Text>
        </Stack>
    );
};

export default ConversationNavbarFooter;
