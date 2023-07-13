import { useAppStore } from "../..";

export const setLastChangelog = (value: string) => {
    useAppStore.setState((state) => {
        state.lastChangelog = value;
    });
};
