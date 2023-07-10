import { useAppStore } from "../..";

export const dismissFunctionsImportWarning = () => {
    useAppStore.setState({ showFunctionsImportWarning: false });
};
