import React from "react";
import { useAppStore } from "../..";

export const useGetFunction = () => {
    const functions = useAppStore((state) => state.callableFunctions);

    return React.useCallback(
        (id: string) => {
            const callableFunction = functions.find((fn) => fn.id === id);
            return callableFunction;
        },
        [functions]
    );
};
