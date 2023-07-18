import { AppStateSlice } from "..";
import { ColorScheme } from "@mantine/core";

export interface AppSettingsState {
    showUsage: boolean;
    colorScheme: ColorScheme;
    lastChangelog: string;
    showConversationImport: boolean;
}

export const initialAppSettingsState: AppSettingsState = {
    showUsage: false,
    colorScheme: "light",
    lastChangelog: "",
    showConversationImport: true,
};

export const createAppSettingsSlice: AppStateSlice<AppSettingsState> = () =>
    initialAppSettingsState;
