"use client";

import { createTheme } from "@mantine/core";
import { themeToVars } from "@mantine/vanilla-extract";

/**
 * This is the base theme for the app without component overrides.
 * Overrides should be done separately to prevent circular dependencies for component override classNames.
 */
export const theme = createTheme({
    primaryColor: "orange",
});

/**
 * This is the base vars for the app without component overrides.
 */
export const vars = themeToVars(theme);
