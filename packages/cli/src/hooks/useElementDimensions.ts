import { DOMElement, useStdout, measureElement } from "ink";
import React from "react";

export const useElementDimensions = () => {
    const ref = React.useRef<DOMElement>(null);
    const [width, setWidth] = React.useState(0);
    const [height, setHeight] = React.useState(0);
    const [hasInit, setHasInit] = React.useState(false);
    const { stdout } = useStdout();

    const handleStdoutResize = React.useCallback(() => {
        if (ref.current === null) return { width: 0, height: 0 };
        let { width, height } = measureElement(ref.current);

        // checking for 'null' doesn't work here...
        if (!width) width = 0;
        if (!height) height = 0;

        setWidth(width);
        setHeight(height);
        return { width: width, height: height };
    }, []);

    React.useEffect(() => {
        stdout.on("resize", handleStdoutResize);
        return () => {
            stdout.off("resize", handleStdoutResize);
        };
    }, [handleStdoutResize, stdout]);

    React.useEffect(() => {
        if (hasInit) return;

        const initSize = () => {
            const { width, height } = handleStdoutResize();
            if (width === 0 || height === 0) return false;
            setHasInit(true);
            return true;
        };
        if (initSize()) return;

        const interval = setInterval(() => {
            if (initSize()) clearInterval(interval);
        }, 100);

        return () => {
            clearInterval(interval);
        };
    }, [handleStdoutResize, hasInit]);

    return { ref, width, height };
};
