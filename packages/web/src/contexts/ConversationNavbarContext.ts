import React from "react";
import makeNotImplemented from "../utils/makeNotImplemented";

export interface ConversationNavbarContextValue {
    navbarOpened: boolean;
    openNavbar: () => void;
    closeNavbar: () => void;
    toggleNavbar: () => void;
}

const notImplemented = makeNotImplemented("ConversationNavbarContext");
export const ConversationNavbarContext =
    React.createContext<ConversationNavbarContextValue>({
        navbarOpened: false,
        openNavbar: notImplemented,
        closeNavbar: notImplemented,
        toggleNavbar: notImplemented,
    });
