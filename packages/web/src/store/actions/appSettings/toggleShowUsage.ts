import { useAppStore } from "../..";

export const toggleShowUsage = (showUsage?: boolean) => {
    useAppStore.setState((state) => {
        state.showUsage = showUsage ?? !state.showUsage;
    });
};
