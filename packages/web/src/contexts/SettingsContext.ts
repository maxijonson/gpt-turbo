import {
    DEFAULT_CONTEXT,
    DEFAULT_DISABLEMODERATION,
    DEFAULT_DRY,
    DEFAULT_MODEL,
    DEFAULT_STREAM,
} from "gpt-turbo";
import React from "react";
import makeNotImplemented from "../utils/makeNotImplemented";
import { Settings } from "../entities/settings";

export interface SettingsContextValue {
    settings: Settings;
    setSettings: (settings: Settings) => void;
}

const notImplemented = makeNotImplemented("SettingsContext");
export const SettingsContext = React.createContext<SettingsContextValue>({
    settings: {
        save: false,

        apiKey: "",
        model: DEFAULT_MODEL,
        context: DEFAULT_CONTEXT,
        dry: DEFAULT_DRY,
        disableModeration: DEFAULT_DISABLEMODERATION,
        stream: DEFAULT_STREAM,

        temperature: 1,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        stop: null,
        max_tokens: Infinity,
        logit_bias: undefined,
        user: "",

        functionIds: [],

        headers: undefined,
        proxy: undefined,
    },
    setSettings: notImplemented,
});
