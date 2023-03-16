import {
    DEFAULT_CONTEXT,
    DEFAULT_DISABLEMODERATION,
    DEFAULT_DRY,
    DEFAULT_MODEL,
} from "gpt-turbo";
import React from "react";
import { ConfigContext, ConfigContextValue } from "../ConfigContext.js";

interface ConfigProviderProps {
    children?: React.ReactNode;
}

export default ({ children }: ConfigProviderProps) => {
    const [apiKey, setApiKey] = React.useState("");
    const [model, setModel] = React.useState<string>(DEFAULT_MODEL);
    const [dry, setDry] = React.useState<boolean>(DEFAULT_DRY);
    const [context, setContext] = React.useState<string>(DEFAULT_CONTEXT);
    const [disableModeration, setDisableModeration] = React.useState<
        boolean | "soft"
    >(DEFAULT_DISABLEMODERATION);

    const providerValue = React.useMemo<ConfigContextValue>(
        () => ({
            apiKey,
            model,
            dry,
            context,
            disableModeration,
            setApiKey,
            setModel,
            setDry,
            setContext,
            setDisableModeration,
        }),
        [apiKey, context, disableModeration, dry, model]
    );

    return (
        <ConfigContext.Provider value={providerValue}>
            {children}
        </ConfigContext.Provider>
    );
};
