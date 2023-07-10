import { useAppStore } from "../..";

export const dismissFunctionsWarning = () => {
    useAppStore.setState({ showFunctionsWarning: false });
};
