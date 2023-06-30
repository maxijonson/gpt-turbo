import React from "react";
import { SettingsContext, SettingsContextValue } from "../SettingsContext";
import useStorage from "../../hooks/useStorage";
import { Settings, settingsSchema } from "../../entities/settings";

interface SettingsProviderProps {
    children?: React.ReactNode;
}

const SettingsProvider = ({ children }: SettingsProviderProps) => {
    const { value: settings, setValue: setSettings } = useStorage<Settings>(
        "gpt-turbo-settings",
        settingsSchema.parse({}),
        settingsSchema
    );

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
        }),
        [handleSetSettings, settings]
    );

    return (
        <SettingsContext.Provider value={providerValue}>
            {children}
        </SettingsContext.Provider>
    );
};

export default SettingsProvider;
