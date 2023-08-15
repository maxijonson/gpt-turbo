"use client";

import cx from "clsx";
import {
    Box,
    BoxProps,
    ElementProps,
    createPolymorphicComponent,
} from "@mantine/core";
import React, { forwardRef } from "react";
import * as classes from "./LightDark.css";
import { PolymorphicComponentProps } from "./LightDark.types";

interface LightDarkProps<C extends React.ElementType>
    extends BoxProps,
        ElementProps<"div", keyof BoxProps> {
    light?: React.ReactNode;
    lightProps?: Partial<React.ComponentPropsWithoutRef<C>>;
    dark?: React.ReactNode;
    darkProps?: Partial<React.ComponentPropsWithoutRef<C>>;
}

const _LightDark = forwardRef<HTMLDivElement, LightDarkProps<"div">>(
    function LightDark(
        { light, lightProps, dark, darkProps, children, ...rest },
        ref
    ) {
        const Dark = (
            <Box
                {...rest}
                {...darkProps}
                ref={ref}
                className={cx(rest.className, classes.dark)}
            >
                {children ?? dark}
            </Box>
        );

        const Light = (
            <Box
                {...rest}
                {...lightProps}
                ref={ref}
                className={cx(rest.className, classes.light)}
            >
                {children ?? light}
            </Box>
        );

        return (
            <>
                {Dark}
                {Light}
            </>
        );
    }
);

const PolymorphicLightDark = createPolymorphicComponent<
    "div",
    LightDarkProps<"div">
>(_LightDark);

const LightDark = <C extends React.ElementType = "div">(
    props: PolymorphicComponentProps<C, LightDarkProps<C>>
) => {
    return <PolymorphicLightDark {...props} />;
};

export default LightDark;
