import React from "react";
import AppFocusProvider from "./AppFocusProvider.js";
import DebugProvider from "./DebugProvider.js";

interface ProvidersProps {
    children?: React.ReactNode;
}

export default ({ children }: ProvidersProps) => {
    return (
        <DebugProvider>
            <AppFocusProvider>{children}</AppFocusProvider>
        </DebugProvider>
    );
};
