import { useAppStore } from "../..";

export const removeAllSavedPrompts = () => {
    useAppStore.setState((state) => {
        state.savedPrompts = [];
    });
};
