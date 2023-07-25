import React from "react";
import { useAppStore } from "../..";
import getUniqueString from "../../../utils/getUniqueString";

export const useGetUniqueFunctionName = () => {
    const callableFunctions = useAppStore((state) => state.callableFunctions);
    const names = React.useMemo(
        () =>
            callableFunctions.map((callableFunction) => callableFunction.name),
        [callableFunctions]
    );

    return React.useCallback(
        (name: string, extraNames: string[] = []) => {
            const usedNames = [...names, ...extraNames];
            return getUniqueString(name, usedNames, (n, i) => `${n}${i}`);
        },
        [names]
    );
};
