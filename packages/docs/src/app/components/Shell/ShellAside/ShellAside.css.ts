import { style } from "@vanilla-extract/css";
import { SHELLASIDE_WIDTH } from "../../../../config/constants";
import { rem } from "@mantine/core";

export const tabLabel = style({
    wordBreak: "break-word",
    maxWidth: rem(SHELLASIDE_WIDTH - 40),
    whiteSpace: "normal",
});
