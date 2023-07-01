import { CallableFunction, CallableFunctionModel } from "gpt-turbo";
import React from "react";
import makeNotImplemented from "../utils/makeNotImplemented";

export interface CallableFunctionsContextValue {
    callableFunctions: CallableFunction[];
    showFunctionsWarning: boolean;
    showFunctionsImportWarning: boolean;

    addCallableFunction: (
        callableFunctionConfig: CallableFunction | CallableFunctionModel,
        displayName: string,
        code?: string
    ) => CallableFunction;
    getCallableFunction: (id: string) => CallableFunction;
    getCallableFunctionDisplayName: (id: string) => string;
    getCallableFunctionCode: (id: string) => string | undefined;
    dismissFunctionsWarning: () => void;
    dismissFunctionsImportWarning: () => void;
    callFunction: (
        id: string,
        args: Record<string, unknown>
    ) => Promise<unknown | undefined>;
    deleteCallableFunction: (id: string) => void;
}

const notImplemented = makeNotImplemented("CallableFunctionsContext");
export const CallableFunctionsContext =
    React.createContext<CallableFunctionsContextValue>({
        callableFunctions: [],
        showFunctionsWarning: true,
        showFunctionsImportWarning: true,

        addCallableFunction: notImplemented,
        getCallableFunction: notImplemented,
        getCallableFunctionDisplayName: notImplemented,
        getCallableFunctionCode: notImplemented,
        dismissFunctionsWarning: notImplemented,
        dismissFunctionsImportWarning: notImplemented,
        callFunction: notImplemented,
        deleteCallableFunction: notImplemented,
    });
