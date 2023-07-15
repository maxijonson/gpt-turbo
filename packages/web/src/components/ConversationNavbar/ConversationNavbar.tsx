import { Divider, Navbar, useMantineTheme } from "@mantine/core";
import Usage from "../Usage/Usage";
import { useMediaQuery } from "@mantine/hooks";
import NavbarConversations from "./NavbarConversations/NavbarConversations";
import { useAppStore } from "../../store";
import ConversationNavbarHeader from "./ConversationNavbarHeader/ConversationNavbarHeader";
import { useActiveConversation } from "../../store/hooks/conversations/useActiveConversation";
import useConversationNavbar from "../../contexts/hooks/useConversationNavbar";
import ConversationNavbarBurger from "./ConversationNavbarBurger";
import ConversationNavbarFooter from "./ConversationNavbarFooter/ConversationNavbarFooter";

const ConversationNavbar = () => {
    const activeConversation = useActiveConversation();
    const { navbarOpened, closeNavbar } = useConversationNavbar();
    const showUsage = useAppStore((state) => state.showUsage);
    const theme = useMantineTheme();

    const isSm = useMediaQuery(`(max-width: ${theme.breakpoints.md})`);

    return (
        <>
            <ConversationNavbarBurger />
            <Navbar
                width={{ sm: 300 }}
                p="xs"
                hiddenBreakpoint="sm"
                hidden={isSm && !navbarOpened}
            >
                <Navbar.Section>
                    <ConversationNavbarHeader />
                    <Divider my="xs" />
                </Navbar.Section>
                <Navbar.Section grow h={0}>
                    <NavbarConversations onConversationSelect={closeNavbar} />
                </Navbar.Section>
                {activeConversation && showUsage && (
                    <Navbar.Section>
                        <>
                            <Divider my="xs" />
                            <Usage conversation={activeConversation} />
                        </>
                    </Navbar.Section>
                )}
                <Navbar.Section>
                    <Divider my="xs" />
                    <ConversationNavbarFooter />
                </Navbar.Section>
            </Navbar>
        </>
    );
};

export default ConversationNavbar;
