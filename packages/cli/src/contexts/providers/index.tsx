import React from "react";
import AppFocusProvider from "./AppFocusProvider.js";
import ConfigProvider from "./ConfigProvider.js";
import DebugProvider from "./DebugProvider.js";

interface ProvidersProps {
    children?: React.ReactNode;
}

export default ({ children }: ProvidersProps) => {
    return (
        <DebugProvider>
            <ConfigProvider>
                <AppFocusProvider>{children}</AppFocusProvider>
            </ConfigProvider>
        </DebugProvider>
    );
};
