import { AppStateSlice } from "..";
import { ColorScheme } from "@mantine/core";

export interface AppSettingsState {
    showUsage: boolean;
    colorScheme: ColorScheme;
}

export const initialAppSettingsState: AppSettingsState = {
    showUsage: false,
    colorScheme: "light",
};

export const createAppSettingsSlice: AppStateSlice<AppSettingsState> = () =>
    initialAppSettingsState;
