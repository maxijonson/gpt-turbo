import React from "react";
import makeNotImplemented from "../utils/makeNotImplemented";

export interface Settings {
    apiKey: string;
}

export interface SettingsContextValue {
    settings: Settings;
    setSettings: (settings: Settings) => void;
    areSettingsLoaded: boolean;
}

const notImplemented = makeNotImplemented("SettingsContext");
export const SettingsContext = React.createContext<SettingsContextValue>({
    settings: {
        apiKey: "",
    },
    setSettings: notImplemented,
    areSettingsLoaded: false,
});
