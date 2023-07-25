import React from "react";
import { useAppStore } from "../..";
import getUniqueString from "../../../utils/getUniqueString";

export const useGetUniqueFunctionDisplayName = () => {
    const callableFunctionDisplayNames = useAppStore(
        (state) => state.callableFunctionDisplayNames
    );

    return React.useCallback(
        (displayName: string, extraDisplayNames: string[] = []) => {
            const usedDisplayNames = [
                ...Object.values(callableFunctionDisplayNames),
                ...extraDisplayNames,
            ];
            return getUniqueString(
                displayName,
                usedDisplayNames,
                (str, i) => `${str} (${i})`
            );
        },
        [callableFunctionDisplayNames]
    );
};
