import { style } from "@vanilla-extract/css";
import { vars } from "@theme";

export const dark = style({
    display: "block",

    selectors: {
        [vars.lightSelector]: {
            display: "none",
        },
    },
});

export const light = style({
    display: "block",

    selectors: {
        [vars.darkSelector]: {
            display: "none",
        },
    },
});
