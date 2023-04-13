import { DEFAULT_CONTEXT, DEFAULT_DRY, DEFAULT_MODEL } from "gpt-turbo";
import React from "react";
import makeNotImplemented from "../utils/makeNotImplemented";
import { Settings } from "../entities/settings";

export interface SettingsContextValue {
    settings: Settings;
    setSettings: (settings: Settings) => void;
    areSettingsLoaded: boolean;
}

const notImplemented = makeNotImplemented("SettingsContext");
export const SettingsContext = React.createContext<SettingsContextValue>({
    settings: {
        apiKey: "",
        model: DEFAULT_MODEL,
        context: DEFAULT_CONTEXT,
        dry: DEFAULT_DRY,
        disableModeration: "on",
        stream: true,
        save: false,
    },
    setSettings: notImplemented,
    areSettingsLoaded: false,
});
