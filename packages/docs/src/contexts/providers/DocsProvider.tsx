"use client";

import React from "react";
import { DocsContext, DocsContextValue } from "../DocsContext";
import type { PartialDoc } from "@mdx/docs";

interface DocsProviderProps {
    children?: React.ReactNode;
    docs: PartialDoc[];
}

const DocsProvider = ({ children, docs }: DocsProviderProps) => {
    const groupedDocs = React.useMemo<DocsContextValue["groupedDocs"]>(() => {
        return docs.reduce(
            (acc, doc) => {
                if (doc.isGroupIndex) return acc;

                const [group, page] = doc.slug.split("/");
                if (!acc[group]) {
                    acc[group] = {};
                }
                acc[group][page] = doc;

                return acc;
            },
            {} as DocsContextValue["groupedDocs"]
        );
    }, [docs]);

    const docGroupIndexes = React.useMemo<
        DocsContextValue["docGroupIndexes"]
    >(() => {
        return docs.reduce(
            (acc, doc) => {
                if (doc.isGroupIndex) {
                    acc.push(doc);
                }
                return acc;
            },
            [] as DocsContextValue["docGroupIndexes"]
        );
    }, [docs]);

    const providerValue = React.useMemo<DocsContextValue>(
        () => ({
            docs,
            groupedDocs,
            docGroupIndexes,
        }),
        [docGroupIndexes, docs, groupedDocs]
    );

    return (
        <DocsContext.Provider value={providerValue}>
            {children}
        </DocsContext.Provider>
    );
};

export default DocsProvider;
