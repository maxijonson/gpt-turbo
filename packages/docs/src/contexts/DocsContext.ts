import React from "react";
import type { PartialDoc } from "../mdx/docs";

export interface DocsContextValue {
    docs: PartialDoc[];
    groupedDocs: Record<string, Record<string, PartialDoc>>;
    docGroupIndexes: PartialDoc[];
}

export const DocsContext = React.createContext<DocsContextValue>({
    docs: [],
    groupedDocs: {},
    docGroupIndexes: [],
});
