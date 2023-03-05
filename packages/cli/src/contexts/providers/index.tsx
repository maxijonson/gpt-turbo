import React from "react";
import DebugProvider from "./DebugProvider.js";

interface ProvidersProps {
    children?: React.ReactNode;
}

export default ({ children }: ProvidersProps) => {
    return <DebugProvider>{children}</DebugProvider>;
};
