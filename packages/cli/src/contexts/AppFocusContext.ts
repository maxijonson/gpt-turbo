import { useFocusManager } from "ink";
import React from "react";
import makeNotImplemented from "../utils/makeNotImplemented.js";

export interface AppFocusContextValue
    extends ReturnType<typeof useFocusManager> {
    activeId: string | null;
    setActiveId: React.Dispatch<React.SetStateAction<string | null>>;
}

const notImplemented = makeNotImplemented("AppFocusContext");

export const AppFocusContext = React.createContext<AppFocusContextValue>({
    disableFocus: notImplemented,
    enableFocus: notImplemented,
    focusNext: notImplemented,
    focusPrevious: notImplemented,
    focus: notImplemented,
    activeId: null,
    setActiveId: notImplemented,
});
