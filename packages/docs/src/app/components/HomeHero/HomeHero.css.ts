import { style } from "@vanilla-extract/css";
import { vars } from "@theme";
import { rem } from "@mantine/core";

const freq = rem(28);
const size = rem(2);

export const root = style({
    height: `calc(100vh - ${rem(60)})`,
    boxShadow: vars.shadows.sm,

    borderBottom: "1px solid",
    borderBottomColor: vars.colors.gray[4],

    backgroundColor: vars.colors.gray[1],
    backgroundImage: `radial-gradient(${vars.colors.gray[3]} ${size}, transparent 0)`,
    backgroundSize: `${freq} ${freq}`,

    selectors: {
        [vars.darkSelector]: {
            borderBottomColor: vars.colors.gray[8],

            backgroundColor: vars.colors.dark[8],
            backgroundImage: `radial-gradient(${vars.colors.dark[7]} ${size}, transparent 0)`,
        },
    },
});
