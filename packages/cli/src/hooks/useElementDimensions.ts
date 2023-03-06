import { DOMElement } from "ink";
import React from "react";

export const useElementDimensions = () => {
    const ref = React.useRef<DOMElement>(null);
    const width = ref.current?.yogaNode?.getComputedWidth() ?? 0;
    const height = ref.current?.yogaNode?.getComputedHeight() ?? 0;

    return { ref, width, height };
};
