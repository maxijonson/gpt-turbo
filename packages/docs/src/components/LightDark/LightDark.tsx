"use client";

import cx from "clsx";
import { Box, BoxProps, createPolymorphicComponent } from "@mantine/core";
import { forwardRef } from "react";
import * as classes from "./LightDark.css";

interface LightDarkProps extends BoxProps {
    children?: never;
    light: React.ReactNode;
    dark: React.ReactNode;
}

const LightDark = createPolymorphicComponent<"div", LightDarkProps>(
    forwardRef<HTMLDivElement, LightDarkProps>(function LightDark(
        { light, dark, ...rest },
        ref
    ) {
        return (
            <>
                <Box
                    {...rest}
                    ref={ref}
                    className={cx(rest.className, classes.dark)}
                >
                    {dark}
                </Box>
                <Box
                    {...rest}
                    ref={ref}
                    className={cx(rest.className, classes.light)}
                >
                    {light}
                </Box>
            </>
        );
    })
);

export default LightDark;
