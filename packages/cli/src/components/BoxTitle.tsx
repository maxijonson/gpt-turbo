import { Box, Text } from "ink";
import React from "react";

interface BoxTitleProps {
    title: React.ReactNode;
}

export default ({ title }: BoxTitleProps) => {
    return (
        <Box justifyContent="center">
            <Text bold underline>
                {title}
            </Text>
        </Box>
    );
};
