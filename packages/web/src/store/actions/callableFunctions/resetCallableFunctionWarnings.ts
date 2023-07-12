import { useAppStore } from "../..";

export const resetCallableFunctionWarnings = () => {
    useAppStore.setState((state) => {
        state.showFunctionsWarning = true;
        state.showFunctionsImportWarning = true;
    });
};
