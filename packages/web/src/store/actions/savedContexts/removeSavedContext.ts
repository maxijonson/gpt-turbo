import { useAppStore } from "../..";

export const removeSavedContext = (contextName: string) => {
    useAppStore.setState((state) => {
        state.savedContexts = state.savedContexts.filter(
            (context) => context.name !== contextName
        );
    });
};
