import React, { useState } from "react";
import { useStdout } from "ink";

export default (): [number, number] => {
    const { stdout } = useStdout();
    const [dimensions, setDimensions] = useState<[number, number]>([
        stdout.columns,
        stdout.rows,
    ]);

    React.useLayoutEffect(() => {
        const handler = () => setDimensions([stdout.columns, stdout.rows]);
        stdout.on("resize", handler);
        return () => {
            stdout.off("resize", handler);
        };
    }, [stdout]);

    return dimensions;
};
