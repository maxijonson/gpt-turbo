import { CallableFunction } from "gpt-turbo";
import { AppStateSlice } from "..";

export interface CallableFunctionsState {
    callableFunctions: CallableFunction[];
    callableFunctionDisplayNames: Record<string, string>;
    callableFunctionCodes: Record<string, string>;
    showFunctionsWarning: boolean;
    showFunctionsImportWarning: boolean;
}

export const initialCallableFunctionsState: CallableFunctionsState = {
    callableFunctions: [],
    callableFunctionDisplayNames: {},
    callableFunctionCodes: {},
    showFunctionsWarning: true,
    showFunctionsImportWarning: true,
};

export const createCallableFunctionsSlice: AppStateSlice<
    CallableFunctionsState
> = () => initialCallableFunctionsState;
