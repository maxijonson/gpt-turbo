import React from "react";
import {
    ConversationNavbarContext,
    ConversationNavbarContextValue,
} from "../ConversationNavbarContext";
import { useDisclosure } from "@mantine/hooks";

interface ConversationNavbarProviderProps {
    children?: React.ReactNode;
}

const ConversationNavbarProvider = ({
    children,
}: ConversationNavbarProviderProps) => {
    const [
        navbarOpened,
        { open: openNavbar, close: closeNavbar, toggle: toggleNavbar },
    ] = useDisclosure();

    const providerValue = React.useMemo<ConversationNavbarContextValue>(
        () => ({
            navbarOpened,
            openNavbar,
            closeNavbar,
            toggleNavbar,
        }),
        [closeNavbar, navbarOpened, openNavbar, toggleNavbar]
    );

    return (
        <ConversationNavbarContext.Provider value={providerValue}>
            {children}
        </ConversationNavbarContext.Provider>
    );
};

export default ConversationNavbarProvider;
