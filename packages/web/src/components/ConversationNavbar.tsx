import {
    Anchor,
    Burger,
    Divider,
    Group,
    MediaQuery,
    Navbar,
    Stack,
    Text,
    createStyles,
    useMantineTheme,
} from "@mantine/core";
import useConversationManager from "../hooks/useConversationManager";
import { BiCog, BiPlus } from "react-icons/bi";
import TippedActionIcon from "./TippedActionIcon";
import { openModal } from "@mantine/modals";
import SettingsForm from "./SettingsForm";
import React from "react";
import Usage from "./Usage";
import { useMediaQuery } from "@mantine/hooks";
import { BsDiscord, BsGithub } from "react-icons/bs";
import NavbarConversations from "./NavbarConversations";
import { AiOutlineFunction } from "react-icons/ai";

const useStyles = createStyles(() => ({
    burger: {
        position: "absolute",
        top: 0,
        right: 0,
        zIndex: 101,
    },
}));

const AppNavbar = () => {
    const { activeConversation, setActiveConversation, showUsage } =
        useConversationManager();
    const { classes } = useStyles();
    const theme = useMantineTheme();

    const [opened, setOpened] = React.useState(false);
    const isSm = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);

    const closeNavbar = React.useCallback(() => {
        setOpened(false);
    }, []);

    return (
        <>
            <MediaQuery
                largerThan="sm"
                styles={{
                    display: "none",
                }}
            >
                <Burger
                    className={classes.burger}
                    opened={opened}
                    onClick={() => setOpened((c) => !c)}
                    size="sm"
                    mt="xs"
                    mr="sm"
                />
            </MediaQuery>
            <Navbar
                width={{ sm: 300 }}
                p="xs"
                hiddenBreakpoint="sm"
                hidden={isSm && !opened}
            >
                <Navbar.Section>
                    <Group position="center">
                        <TippedActionIcon
                            variant="outline"
                            tip="Settings"
                            onClick={() =>
                                openModal({
                                    children: <SettingsForm />,
                                    fullScreen: isSm,
                                    centered: true,
                                    size: "lg",
                                    title: "Settings",
                                })
                            }
                        >
                            <BiCog />
                        </TippedActionIcon>
                        {activeConversation && (
                            <TippedActionIcon
                                variant="outline"
                                onClick={() => {
                                    setActiveConversation(null);
                                    closeNavbar();
                                }}
                                tip="Add conversation"
                            >
                                <BiPlus />
                            </TippedActionIcon>
                        )}
                        <TippedActionIcon
                            tip="Functions Library"
                            variant="outline"
                        >
                            <AiOutlineFunction />
                        </TippedActionIcon>
                    </Group>
                    <Divider my="xs" />
                </Navbar.Section>
                <Navbar.Section grow h={0}>
                    <NavbarConversations onConversationSelect={closeNavbar} />
                </Navbar.Section>
                {activeConversation && showUsage && (
                    <Navbar.Section>
                        <Divider my="xs" />
                        <Usage conversation={activeConversation} />
                    </Navbar.Section>
                )}
                <Navbar.Section>
                    <Divider my="xs" />
                    <Stack spacing={0} p={0}>
                        <Group position="center">
                            <TippedActionIcon
                                tip="View source code"
                                onClick={() =>
                                    window.open(
                                        "https://github.com/maxijonson/gpt-turbo/tree/develop/packages/web"
                                    )
                                }
                                size="xs"
                            >
                                <BsGithub />
                            </TippedActionIcon>
                            <TippedActionIcon
                                tip="Join Discord server"
                                onClick={() =>
                                    window.open("https://discord.gg/Aa77KCmwRx")
                                }
                                size="xs"
                            >
                                <BsDiscord />
                            </TippedActionIcon>
                        </Group>
                        <Text align="center" size="xs">
                            GPT Turbo Web v{APP_VERSION} by{" "}
                            <Anchor href="https://github.com/maxijonson">
                                Tristan Chin
                            </Anchor>
                        </Text>
                    </Stack>
                </Navbar.Section>
            </Navbar>
        </>
    );
};

export default AppNavbar;
