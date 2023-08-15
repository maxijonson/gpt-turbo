import { style } from "@vanilla-extract/css";
import { vars } from "@theme";

export const root = style({
    selectors: {
        [vars.darkSelector]: {
            borderColor: vars.colors.dark[8],
        },
    },
});
