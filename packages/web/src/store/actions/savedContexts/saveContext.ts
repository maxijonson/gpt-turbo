import { useAppStore } from "../..";

export const saveContext = (name: string, value: string) => {
    useAppStore.setState((state) => {
        state.savedContexts.push({ name, value });
    });
};
