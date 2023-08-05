import { style } from "@vanilla-extract/css";
import { vars } from "@theme";

export const titleRoot = style({
    selectors: {
        [vars.darkSelector]: {
            color: vars.colors.red[0],
        },
    },
});
