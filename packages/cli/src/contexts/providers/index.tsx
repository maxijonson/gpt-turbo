import React from "react";
import AppFocusProvider from "./AppFocusProvider.js";
import ConfigProvider from "./ConfigProvider.js";
import DebugProvider from "./DebugProvider.js";

interface ProvidersProps {
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
}: ProvidersProps) => {
    return (
        <DebugProvider>
            <ConfigProvider
                initialApiKey={initialApiKey}
                initialModel={initialModel}
                initialDry={initialDry}
                initialContext={initialContext}
                initialDisableModeration={initialDisableModeration}
                initialStream={initialStream}
            >
                <AppFocusProvider>{children}</AppFocusProvider>
            </ConfigProvider>
        </DebugProvider>
    );
};
