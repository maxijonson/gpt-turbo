import { useAppStore } from "../..";

export const deleteCallableFunction = (id: string) => {
    useAppStore.setState((state) => {
        state.callableFunctions = state.callableFunctions.filter(
            (f) => f.id !== id
        );
        delete state.callableFunctionDisplayNames[id];
        delete state.callableFunctionCodes[id];
    });
};
