import { ChatCompletionModel } from "gpt-turbo";
import React from "react";
import makeNotImplemented from "../utils/makeNotImplemented.js";

export interface ConfigContextValue {
    apiKey: string;
    dry: boolean;
    model: ChatCompletionModel;
    context: string;
    setApiKey: React.Dispatch<React.SetStateAction<string>>;
    setDry: React.Dispatch<React.SetStateAction<boolean>>;
    setModel: React.Dispatch<React.SetStateAction<ChatCompletionModel>>;
    setContext: React.Dispatch<React.SetStateAction<string>>;
}

const notImplemented = makeNotImplemented("ConfigContext");
export const ConfigContext = React.createContext<ConfigContextValue>({
    apiKey: "",
    dry: false,
    model: "gpt-3.5-turbo",
    context: "",
    setApiKey: notImplemented,
    setDry: notImplemented,
    setModel: notImplemented,
    setContext: notImplemented,
});
