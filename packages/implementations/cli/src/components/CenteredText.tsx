import { TextProps, Box, Text } from "ink";
import React from "react";
import { useElementDimensions } from "../hooks/useElementDimensions.js";

export default ({
    children,
    ...props
}: Omit<TextProps, "children"> & { children: string }) => {
    const { ref, width } = useElementDimensions();
    const [textParts, setTextParts] = React.useState([children]);

    React.useLayoutEffect(() => {
        const parts = children.split(" ").reduce(
            (acc, word) => {
                const lastLine = acc[acc.length - 1];

                if (lastLine.length + word.length + 1 <= width) {
                    acc[acc.length - 1] = lastLine + " " + word;
                } else {
                    acc.push(word);
                }
                return acc;
            },
            [""]
        );
        setTextParts(parts);
    }, [children, width]);

    return (
        <Box ref={ref} flexDirection="column" alignItems="center" width="100%">
            {textParts.map((part, i) => (
                <Text key={i} {...props}>
                    {part}
                </Text>
            ))}
        </Box>
    );
};
