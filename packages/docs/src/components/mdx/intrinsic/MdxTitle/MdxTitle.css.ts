import { rem } from "@mantine/core";
import { style } from "@vanilla-extract/css";
import { SHELLHEADER_HEIGHT } from "../../../../config/constants";

export const idMarker = style({
    position: "relative",
    top: rem(-SHELLHEADER_HEIGHT),
});
