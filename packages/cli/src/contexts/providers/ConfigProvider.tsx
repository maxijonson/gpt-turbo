import {
    DEFAULT_CONTEXT,
    DEFAULT_DISABLEMODERATION,
    DEFAULT_DRY,
    DEFAULT_MODEL,
    DEFAULT_STREAM,
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
    initialStream?: boolean;
}

export default ({
    children,
    initialApiKey,
    initialModel,
    initialDry,
    initialContext,
    initialDisableModeration,
    initialStream,
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
    const [stream, setStream] = React.useState<boolean>(
        initialStream ?? DEFAULT_STREAM
    );

    const providerValue = React.useMemo<ConfigContextValue>(
        () => ({
            apiKey,
            model,
            dry,
            context,
            disableModeration,
            stream,
            setApiKey,
            setModel,
            setDry,
            setContext,
            setDisableModeration,
            setStream,
        }),
        [apiKey, context, disableModeration, dry, model, stream]
    );

    return (
        <ConfigContext.Provider value={providerValue}>
            {children}
        </ConfigContext.Provider>
    );
};
