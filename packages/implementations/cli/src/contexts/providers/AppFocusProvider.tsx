/* eslint-disable no-console */
import { useFocusManager, useInput } from "ink";
import React from "react";
import { FOCUSID_PROMPT } from "../../config/constants.js";
import { AppFocusContext, AppFocusContextValue } from "../AppFocusContext.js";

interface AppFocusProviderProps {
    children?: React.ReactNode;
}

export default ({ children }: AppFocusProviderProps) => {
    const { disableFocus, enableFocus, focus, focusNext, focusPrevious } =
        useFocusManager();
    const [activeId, setActiveId] = React.useState<string | null>(null);

    const handleInput = React.useCallback(
        (input: string) => {
            if (input === "p") {
                focus(FOCUSID_PROMPT);
            }
        },
        [focus]
    );
    useInput(handleInput, { isActive: activeId !== FOCUSID_PROMPT });

    const providerValue = React.useMemo<AppFocusContextValue>(
        () => ({
            disableFocus,
            enableFocus,
            focus,
            focusNext,
            focusPrevious,
            activeId,
            setActiveId,
        }),
        [activeId, disableFocus, enableFocus, focus, focusNext, focusPrevious]
    );

    return (
        <AppFocusContext.Provider value={providerValue}>
            {children}
        </AppFocusContext.Provider>
    );
};
