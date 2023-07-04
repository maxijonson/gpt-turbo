import React from "react";
import { SettingsContext, SettingsContextValue } from "../SettingsContext";
import useStorage from "../../hooks/useStorage";
import { Settings, settingsSchema } from "../../entities/settings";
import { STORAGEKEY_SETTINGS } from "../../config/constants";

interface SettingsProviderProps {
    children?: React.ReactNode;
}

const SettingsProvider = ({ children }: SettingsProviderProps) => {
    const { value: settings, setValue: setSettings } = useStorage<Settings>(
        STORAGEKEY_SETTINGS,
        settingsSchema.parse({
            version: "0.0.0",
        }),
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
