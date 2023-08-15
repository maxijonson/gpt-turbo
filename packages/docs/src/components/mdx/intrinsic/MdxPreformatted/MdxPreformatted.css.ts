import { globalStyle, style } from "@vanilla-extract/css";
import { vars } from "@theme";

export const root = style({
    border: "1px solid",
    borderColor: vars.colors.gray[3],
    borderRadius: vars.radius.md,

    selectors: {
        [vars.darkSelector]: {
            borderColor: vars.colors.gray[7],
        },
    },
});

globalStyle(`${root}.${root} code`, {
    backgroundColor: "transparent",
});
