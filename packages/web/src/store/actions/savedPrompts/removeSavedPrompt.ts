import { useAppStore } from "../..";

export const removeSavedPrompt = (promptName: string) => {
    useAppStore.setState((state) => {
        state.savedPrompts = state.savedPrompts.filter(
            (prompt) => prompt.name !== promptName
        );
    });
};
