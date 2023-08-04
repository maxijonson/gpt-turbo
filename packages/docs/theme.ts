"use client";

import { ActionIcon, createTheme } from "@mantine/core";
import { themeToVars } from "@mantine/vanilla-extract";

export const theme = createTheme({
    components: {
        ActionIcon: ActionIcon.extend({
            defaultProps: {
                variant: "subtle",
            },
        }),
    },
});
export const vars = themeToVars(theme);
