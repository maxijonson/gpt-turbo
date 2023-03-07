import { useApp, useInput } from "ink";
import React from "react";
import {
    Command,
    CommandContext,
    CommandContextValue,
    CommandHandler,
} from "../CommandContext.js";

interface CommandProviderProps {
    children?: React.ReactNode;
}

export default ({ children }: CommandProviderProps) => {
    const [listeners, setListeners] = React.useState<CommandHandler[]>([]);
    const { exit } = useApp();

    const offCommand = React.useCallback((handler: CommandHandler) => {
        setListeners((prevListeners) =>
            prevListeners.filter((l) => l !== handler)
        );
    }, []);

    const onCommand = React.useCallback(
        (handler: CommandHandler) => {
            setListeners((prevListeners) => [...prevListeners, handler]);
            return () => offCommand(handler);
        },
        [offCommand]
    );

    useInput((input, key) => {
        if (key.escape) {
            exit();
        }

        const command: Command | null = (() => {
            if (key.ctrl && input === "c") {
                return null;
            }

            if (key.ctrl && key.leftArrow) {
                return "prev";
            }

            if (key.ctrl && key.rightArrow) {
                return "next";
            }

            return null;
        })();

        if (command) {
            listeners.forEach((listener) => {
                listener(command);
            });
        }
    });

    const providerValue = React.useMemo<CommandContextValue>(
        () => ({
            onCommand,
            offCommand,
        }),
        [offCommand, onCommand]
    );

    return (
        <CommandContext.Provider value={providerValue}>
            {children}
        </CommandContext.Provider>
    );
};
