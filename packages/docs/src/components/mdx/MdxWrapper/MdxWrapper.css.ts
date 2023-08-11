import { globalStyle, style } from "@vanilla-extract/css";
import { vars } from "@theme";

export const root = style({});
const darkRoot = `[data-mantine-color-scheme="dark"] ${root}`;

globalStyle(
    `${darkRoot} h1, ${darkRoot} h2, ${darkRoot} h3, ${darkRoot} h4, ${darkRoot} h5, ${darkRoot} h6`,
    {
        color: vars.colors.white,
    }
);

globalStyle(`${root} a`, {
    color: vars.colors.orange[8],
});
globalStyle(`${darkRoot} a`, {
    color: vars.colors.anchor,
});

globalStyle(`${root} a.subheading-anchor, ${root} a.subheading-anchor:hover`, {
    color: vars.colors.text,
    textDecoration: "none",
});
