import { ColorScheme } from "@mantine/core";
import { useAppStore } from "../..";

export const toggleColorScheme = (value?: ColorScheme) => {
    useAppStore.setState(({ colorScheme }) => ({
        colorScheme: value || (colorScheme === "dark" ? "light" : "dark"),
    }));
};
