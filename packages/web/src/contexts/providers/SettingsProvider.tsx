import React from "react";
import { DEFAULT_CONTEXT, DEFAULT_DRY, DEFAULT_MODEL } from "gpt-turbo";

import { SettingsContext, SettingsContextValue } from "../SettingsContext";
import useStorage from "../../hooks/useStorage";
import { Settings, settingsSchema } from "../../entities/settings";

interface SettingsProviderProps {
    children?: React.ReactNode;
}

export default ({ children }: SettingsProviderProps) => {
    const {
        value: settings,
        setValue: setSettings,
        isValueLoaded: areSettingsLoaded,
    } = useStorage<Settings>(
        "gpt-turbo-settings",
        {
            apiKey: "",
            model: DEFAULT_MODEL,
            context: DEFAULT_CONTEXT,
            dry: DEFAULT_DRY,
            disableModeration: "on",
            stream: true,
            save: false,
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
            areSettingsLoaded,
        }),
        [handleSetSettings, settings, areSettingsLoaded]
    );

    return (
        <SettingsContext.Provider value={providerValue}>
            {children}
        </SettingsContext.Provider>
    );
};
