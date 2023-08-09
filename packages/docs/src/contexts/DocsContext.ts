import React from "react";
import type { PartialDoc } from "../mdx/docs";

export interface DocsContextValue {
    docs: PartialDoc[];
}

export const DocsContext = React.createContext<DocsContextValue>({
    docs: [],
});
