import React from "react";
import { SettingsContext, SettingsContextValue } from "../SettingsContext";
import useStorage from "../../hooks/useStorage";
import { Settings, settingsSchema } from "../../entities/settings";
import { STORAGEKEY_SETTINGS } from "../../config/constants";
import {
    DEFAULT_CONTEXT,
    DEFAULT_DISABLEMODERATION,
    DEFAULT_DRY,
    DEFAULT_MODEL,
    DEFAULT_STREAM,
} from "gpt-turbo";

interface SettingsProviderProps {
    children?: React.ReactNode;
}

const SettingsProvider = ({ children }: SettingsProviderProps) => {
    const { value: settings, setValue: setSettings } = useStorage<Settings>(
        STORAGEKEY_SETTINGS,
        {
            apiKey: "",
            context: DEFAULT_CONTEXT,
            disableModeration: DEFAULT_DISABLEMODERATION,
            dry: DEFAULT_DRY,
            functionIds: [],
            model: DEFAULT_MODEL,
            save: false,
            stream: DEFAULT_STREAM,
            version: "",
        },
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
