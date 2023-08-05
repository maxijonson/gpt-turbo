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
