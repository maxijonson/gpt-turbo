import { rem } from "@mantine/core";
import { style } from "@vanilla-extract/css";
import { SHELLHEADER_HEIGHT } from "@config/constants";
import { vars } from "@theme";

export const idMarker = style({
    position: "relative",
    top: rem(-SHELLHEADER_HEIGHT),

    selectors: {
        [vars.darkSelector]: {
            color: vars.colors.white,
        },
    },
});
