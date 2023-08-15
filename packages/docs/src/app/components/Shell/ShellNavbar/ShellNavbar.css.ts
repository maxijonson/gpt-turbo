import { style } from "@vanilla-extract/css";
import { vars } from "@theme";

export const root = style({
    selectors: {
        [vars.darkSelector]: {
            backgroundColor: vars.colors.dark[8],
            borderColor: vars.colors.dark[8],
        },
    },
});

export const groupTitle = style({
    textTransform: "uppercase",
});

export const tab = style({
    backgroundColor: "red",

    selectors: {
        "&[data-active]": {
            backgroundColor: vars.colors.orange.light,
        },
        "&[data-active]:hover": {
            backgroundColor: vars.colors.orange.lightHover,
        },
    },
});
