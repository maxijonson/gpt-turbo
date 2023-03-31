import React from "react";
import {
    Settings,
    SettingsContext,
    SettingsContextValue,
} from "../SettingsContext";
import { useLocalStorage } from "@mantine/hooks";

interface SettingsProviderProps {
    children?: React.ReactNode;
}

const SETTINGS_KEY = "gpt-turbo-settings";

export default ({ children }: SettingsProviderProps) => {
    const [settingsCheck] = useLocalStorage<Settings>({
        key: SETTINGS_KEY,
    });
    const [settings, setSettings] = useLocalStorage<Settings>({
        key: SETTINGS_KEY,
        defaultValue: {
            apiKey: "",
        },
    });

    const handleSetSettings = React.useCallback(
        (nextSettings: Parameters<typeof setSettings>[0]) => {
            setSettings((current) => {
                const next =
                    typeof nextSettings === "function"
                        ? nextSettings(current)
                        : nextSettings;
                return { ...current, ...next };
            });
        },
        [setSettings]
    );

    const providerValue = React.useMemo<SettingsContextValue>(
        () => ({
            settings,
            setSettings: handleSetSettings,
            areSettingsLoaded: settingsCheck !== undefined,
        }),
        [handleSetSettings, settings, settingsCheck]
    );

    return (
        <SettingsContext.Provider value={providerValue}>
            {children}
        </SettingsContext.Provider>
    );
};
