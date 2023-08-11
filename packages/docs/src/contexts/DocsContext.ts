import React from "react";
import { GroupedDocs, PartialDoc } from "@utils/types";

export interface DocsContextValue {
    /** All docs as PartialDocs */
    docs: PartialDoc[];

    /** Docs grouped by their slugGroup */
    groupedDocs: GroupedDocs<true>;

    /** All docs that are group indexes. ordered. */
    docGroupIndexes: PartialDoc[];

    /** All docs ordered by their group order and their respective order */
    orderedDocs: PartialDoc[];
}

export const DocsContext = React.createContext<DocsContextValue>({
    docs: [],
    groupedDocs: {},
    docGroupIndexes: [],
    orderedDocs: [],
});
