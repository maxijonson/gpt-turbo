import { useAppStore } from "../..";

export const removeAllCallableFunctions = () => {
    useAppStore.setState((state) => {
        state.callableFunctions = [];
        state.callableFunctionDisplayNames = {};
        state.callableFunctionCodes = {};
    });
};
