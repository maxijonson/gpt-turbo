import React from "react";
import { useAppStore } from "../..";

export const useGetFunctionCode = () => {
    const codes = useAppStore((state) => state.callableFunctionCodes);

    return React.useCallback(
        (id: string): string | undefined => {
            return codes[id];
        },
        [codes]
    );
};
