import { DOMElement, useStdout } from "ink";
import React from "react";

export const useElementDimensions = () => {
    const ref = React.useRef<DOMElement>(null);
    const [width, setWidth] = React.useState(0);
    const [height, setHeight] = React.useState(0);
    const { stdout } = useStdout();

    React.useEffect(() => {
        const handler = () => {
            const computedWidth =
                ref.current?.yogaNode?.getComputedWidth() ?? 0;
            const computedHeight =
                ref.current?.yogaNode?.getComputedHeight() ?? 0;
            setWidth(computedWidth);
            setHeight(computedHeight);
        };
        stdout.on("resize", handler);
        handler();
        return () => {
            stdout.off("resize", handler);
        };
    }, [stdout]);

    return { ref, width, height };
};
