"use client";

import React from "react";
import { DocsContext, DocsContextValue } from "../DocsContext";
import type { PartialDoc } from "@mdx/docs";

interface DocsProviderProps {
    children?: React.ReactNode;
    docs: PartialDoc[];
}

const DocsProvider = ({ children, docs }: DocsProviderProps) => {
    const providerValue = React.useMemo<DocsContextValue>(
        () => ({
            docs,
        }),
        [docs]
    );

    return (
        <DocsContext.Provider value={providerValue}>
            {children}
        </DocsContext.Provider>
    );
};

export default DocsProvider;
