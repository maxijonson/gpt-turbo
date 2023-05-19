import {
    Anchor,
    Burger,
    Divider,
    Group,
    MediaQuery,
    Navbar,
    ScrollArea,
    Stack,
    Text,
    createStyles,
    useMantineColorScheme,
    useMantineTheme,
} from "@mantine/core";
import useConversationManager from "../hooks/useConversationManager";
import {
    BiCog,
    BiDollar,
    BiMoon,
    BiPlus,
    BiSun,
    BiTrash,
} from "react-icons/bi";
import TippedActionIcon from "./TippedActionIcon";
import { openModal } from "@mantine/modals";
import SettingsForm from "./SettingsForm";
import NavbarConversation from "./NavbarConversation";
import React from "react";
import Usage from "./Usage";
import { useMediaQuery } from "@mantine/hooks";
import { BsDiscord, BsGithub } from "react-icons/bs";

const useStyles = createStyles(() => ({
    scrollArea: {
        "& > div": {
            display: "block !important",
        },
    },
    burger: {
        position: "absolute",
        top: 0,
        right: 0,
        zIndex: 101,
    },
}));

export default () => {
    const {
        conversations,
        activeConversation,
        setActiveConversation,
        removeAllConversations,
        showUsage,
        setShowUsage,
    } = useConversationManager();
    const { classes } = useStyles();
    const [isClearingAll, setIsClearingAll] = React.useState(false);
    const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    const theme = useMantineTheme();

    const [opened, setOpened] = React.useState(false);
    const isSm = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);

    const dark = colorScheme === "dark";

    const closeNavbar = React.useCallback(() => {
        setOpened(false);
    }, []);

    const onClearAllClick = React.useCallback(() => {
        if (isClearingAll) {
            removeAllConversations();
        }
        setIsClearingAll((c) => !c);

        if (!isClearingAll) {
            setTimeout(() => {
                setIsClearingAll(false);
            }, 3000);
        }
    }, [isClearingAll, removeAllConversations]);

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
                                    centered: true,
                                    size: "lg",
                                    title: "Settings",
                                })
                            }
                        >
                            <BiCog />
                        </TippedActionIcon>
                        <TippedActionIcon
                            tip={dark ? "Light mode" : "Dark mode"}
                            variant="outline"
                            onClick={() => toggleColorScheme()}
                        >
                            {dark ? <BiSun /> : <BiMoon />}
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
                        {conversations.length && (
                            <TippedActionIcon
                                variant={isClearingAll ? "filled" : "outline"}
                                color={isClearingAll ? "red" : "gray"}
                                tip={
                                    isClearingAll
                                        ? "Confirm"
                                        : "Clear all conversations"
                                }
                                onClick={onClearAllClick}
                            >
                                <BiTrash />
                            </TippedActionIcon>
                        )}
                        {activeConversation && (
                            <TippedActionIcon
                                tip={showUsage ? "Hide usage" : "Show usage"}
                                variant="outline"
                                onClick={() => setShowUsage((c) => !c)}
                            >
                                <BiDollar />
                            </TippedActionIcon>
                        )}
                    </Group>
                    <Divider my="xs" />
                </Navbar.Section>
                <Navbar.Section grow h={0}>
                    <ScrollArea
                        h="100%"
                        classNames={{
                            viewport: classes.scrollArea,
                        }}
                    >
                        <Stack spacing="xs">
                            {conversations.map((conversation) => (
                                <NavbarConversation
                                    key={conversation.id}
                                    conversation={conversation}
                                    onClick={closeNavbar}
                                />
                            ))}
                        </Stack>
                    </ScrollArea>
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
