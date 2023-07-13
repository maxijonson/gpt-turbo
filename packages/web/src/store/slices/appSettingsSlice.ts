import { AppStateSlice } from "..";
import { ColorScheme } from "@mantine/core";

export interface AppSettingsState {
    showUsage: boolean;
    colorScheme: ColorScheme;
    lastChangelog: string;
}

export const initialAppSettingsState: AppSettingsState = {
    showUsage: false,
    colorScheme: "light",
    lastChangelog: "",
};

export const createAppSettingsSlice: AppStateSlice<AppSettingsState> = () =>
    initialAppSettingsState;
