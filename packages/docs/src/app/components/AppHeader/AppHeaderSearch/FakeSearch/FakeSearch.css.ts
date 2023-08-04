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

    borderWidth: rem(1),
    borderStyle: "solid",
    borderRadius: vars.radius.xl,
    borderColor: vars.colors.gray[4],

    selectors: {
        [vars.darkSelector]: {
            borderColor: vars.colors.dark[5],
        },
    },
});
