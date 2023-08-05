import { rem } from "@mantine/core";
import { vars } from "@theme";
import { style } from "@vanilla-extract/css";

export const root = style({
    color: vars.colors.dimmed,
    height: rem(34),
    width: "100%",
});

export const group = style({
    padding: `${rem(4)} ${rem(12)}`,

    border: `${rem(1)} solid`,
    borderRadius: vars.radius.xl,
    borderColor: vars.colors.gray[4],

    selectors: {
        [vars.darkSelector]: {
            backgroundColor: vars.colors.dark[6],
            borderColor: vars.colors.dark[5],
        },
    },
});

export const shortcut = style({
    fontFamily: vars.fontFamilyMonospace,
    backgroundColor: vars.colors.gray[1],

    border: `${rem(1)} solid`,
    borderRadius: vars.radius.xs,
    borderColor: vars.colors.gray[3],

    selectors: {
        [vars.darkSelector]: {
            backgroundColor: vars.colors.dark[7],
            borderColor: vars.colors.dark[7],
        },
    },
});
