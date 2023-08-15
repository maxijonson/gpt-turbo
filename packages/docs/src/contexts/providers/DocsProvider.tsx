"use client";

import React from "react";
import { DocsContext, DocsContextValue } from "../DocsContext";
import { PartialDoc } from "@utils/types";
import sortDocs from "@utils/sortDocs";

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
        const groupIndexes = docs.reduce(
            (acc, doc) => {
                if (doc.isGroupIndex && groupedDocs[doc.slugGroup]) {
                    acc.push(doc);
                }
                return acc;
            },
            [] as DocsContextValue["docGroupIndexes"]
        );
        return sortDocs(groupIndexes);
    }, [docs, groupedDocs]);

    const orderedDocs = React.useMemo<DocsContextValue["orderedDocs"]>(() => {
        return docGroupIndexes.flatMap((groupIndex) => {
            const group = groupedDocs[groupIndex.slugGroup];
            return sortDocs(Object.values(group));
        });
    }, [docGroupIndexes, groupedDocs]);

    const providerValue = React.useMemo<DocsContextValue>(
        () => ({
            docs: sortDocs(docs),
            groupedDocs,
            docGroupIndexes,
            orderedDocs,
        }),
        [docs, groupedDocs, docGroupIndexes, orderedDocs]
    );

    return (
        <DocsContext.Provider value={providerValue}>
            {children}
        </DocsContext.Provider>
    );
};

export default DocsProvider;
