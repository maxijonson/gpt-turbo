import { useAppStore } from "../..";

export const savePrompt = (name: string, value: string) => {
    useAppStore.setState((state) => {
        state.savedPrompts.push({ name, value });
    });
};
