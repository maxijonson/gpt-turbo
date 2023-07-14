import {
    Anchor,
    Burger,
    Divider,
    Group,
    MediaQuery,
    Modal,
    Navbar,
    Stack,
    Text,
    createStyles,
    useMantineTheme,
} from "@mantine/core";
import useConversationManager from "../../hooks/useConversationManager";
import { BiCog, BiPlus } from "react-icons/bi";
import TippedActionIcon from "../common/TippedActionIcon";
import Usage from "../Usage/Usage";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { BsDiscord, BsGithub } from "react-icons/bs";
import NavbarConversations from "./NavbarConversations/NavbarConversations";
import { AiOutlineFunction } from "react-icons/ai";
import { Link } from "react-router-dom";
import SettingsFormModal from "../modals/SettingsFormModal";
import { FaRegQuestionCircle } from "react-icons/fa";
import About from "../About";
import { DISCORD_SERVER_INVITE } from "../../config/constants";
import { useAppStore } from "../../store";
import { setActiveConversation } from "../../store/actions/conversations/setActiveConversation";
import ChangelogButton from "../Changelog/ChangelogButton";

const useStyles = createStyles(() => ({
    burger: {
        position: "absolute",
        top: 0,
        right: 0,
        zIndex: 101,
    },
}));

const AppNavbar = () => {
    const showUsage = useAppStore((state) => state.showUsage);
    const { activeConversation } = useConversationManager();
    const { classes } = useStyles();
    const theme = useMantineTheme();
    const [navbarOpened, { close: closeNavbar, toggle: toggleNavbar }] =
        useDisclosure();
    const [settingsOpened, { open: openSettings, close: closeSettings }] =
        useDisclosure();
    const [showAbout, { open: openAbout, close: closeAbout }] = useDisclosure();

    const isSm = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);

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
                    opened={navbarOpened}
                    onClick={toggleNavbar}
                    size="sm"
                    mt="xs"
                    mr="sm"
                />
            </MediaQuery>
            <Navbar
                width={{ sm: 300 }}
                p="xs"
                hiddenBreakpoint="sm"
                hidden={isSm && !navbarOpened}
            >
                <Navbar.Section>
                    <Group position="center">
                        <TippedActionIcon
                            variant="outline"
                            tip="Default Conversation Settings"
                            onClick={openSettings}
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
                            component={Link}
                            to="/functions"
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
                            <TippedActionIcon
                                tip="About this project"
                                onClick={openAbout}
                                size="xs"
                            >
                                <FaRegQuestionCircle />
                            </TippedActionIcon>
                            <ChangelogButton />
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
            <SettingsFormModal
                opened={settingsOpened}
                onClose={closeSettings}
            />
            <Modal
                opened={showAbout}
                onClose={closeAbout}
                size="lg"
                centered
                title={<Text weight="bold">About GPT Turbo Web</Text>}
            >
                <About />
            </Modal>
        </>
    );
};

export default AppNavbar;
