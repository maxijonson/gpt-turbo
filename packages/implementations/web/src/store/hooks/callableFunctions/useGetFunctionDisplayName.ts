import React from "react";
import { useAppStore } from "../..";

export const useGetFunctionDisplayName = () => {
    const displayNames = useAppStore(
        (state) => state.callableFunctionDisplayNames
    );

    return React.useCallback(
        (id: string): string | undefined => {
            const displayName = displayNames[id];
            return displayName;
        },
        [displayNames]
    );
};
