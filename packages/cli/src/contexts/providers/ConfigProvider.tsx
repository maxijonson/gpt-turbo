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
    initialApiKey?: string;
    initialModel?: string;
    initialDry?: boolean;
    initialContext?: string;
    initialDisableModeration?: boolean | "soft";
}

export default ({
    children,
    initialApiKey,
    initialModel,
    initialDry,
    initialContext,
    initialDisableModeration,
}: ConfigProviderProps) => {
    const [apiKey, setApiKey] = React.useState(initialApiKey ?? "");
    const [model, setModel] = React.useState<string>(
        initialModel ?? DEFAULT_MODEL
    );
    const [dry, setDry] = React.useState<boolean>(initialDry ?? DEFAULT_DRY);
    const [context, setContext] = React.useState<string>(
        initialContext ?? DEFAULT_CONTEXT
    );
    const [disableModeration, setDisableModeration] = React.useState<
        boolean | "soft"
    >(initialDisableModeration ?? DEFAULT_DISABLEMODERATION);

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
