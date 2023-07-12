import { useAppStore } from "../..";

export const removeAllSavedContexts = () => {
    useAppStore.setState((state) => {
        state.savedContexts = [];
    });
};
