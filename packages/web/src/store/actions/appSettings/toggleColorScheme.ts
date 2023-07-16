import { ColorScheme } from "@mantine/core";
import { createAction } from "../createAction";

export const toggleColorScheme = createAction(
    ({ set }, value?: ColorScheme) => {
        set((state) => {
            state.colorScheme =
                value || (state.colorScheme === "dark" ? "light" : "dark");
        });
    },
    "toggleColorScheme"
);
