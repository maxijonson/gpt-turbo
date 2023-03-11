import { ChatCompletionModel } from "gpt-turbo";
import React from "react";
import { ConfigContext, ConfigContextValue } from "../ConfigContext.js";

interface ConfigProviderProps {
    children?: React.ReactNode;
}

export default ({ children }: ConfigProviderProps) => {
    const [apiKey, setApiKey] = React.useState("");
    const [model, setModel] =
        React.useState<ChatCompletionModel>("gpt-3.5-turbo");
    const [dry, setDry] = React.useState(false);
    const [context, setContext] = React.useState("");

    const providerValue = React.useMemo<ConfigContextValue>(
        () => ({
            apiKey,
            model,
            dry,
            context,
            setApiKey,
            setModel,
            setDry,
            setContext,
        }),
        [apiKey, context, dry, model]
    );

    return (
        <ConfigContext.Provider value={providerValue}>
            {children}
        </ConfigContext.Provider>
    );
};
