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
    },
    setSettings: notImplemented,
    areSettingsLoaded: false,
});
