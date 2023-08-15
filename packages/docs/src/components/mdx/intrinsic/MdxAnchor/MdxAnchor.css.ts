import { globalStyle, style } from "@vanilla-extract/css";
import { vars } from "@theme";

export const root = style({
    color: vars.colors.orange[8],
    fontSize: "inherit",
    fontWeight: "inherit",

    selectors: {
        [vars.darkSelector]: {
            color: vars.colors.anchor,
        },
        "&.subheading-anchor, &.subheading-anchor:hover": {
            color: "inherit",
            textDecoration: "none",
        },
    },
});

globalStyle(`${root}.${root} > code`, {
    color: "inherit",
});
