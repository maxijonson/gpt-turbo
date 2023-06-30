import { CallableFunction, CallableFunctionModel } from "gpt-turbo";
import React from "react";
import makeNotImplemented from "../utils/makeNotImplemented";

export interface CallableFunctionsContextValue {
    callableFunctions: CallableFunction[];
    showFunctionsWarning: boolean;

    addCallableFunction: (
        callableFunctionConfig: CallableFunction | CallableFunctionModel,
        displayName: string,
        code?: string
    ) => CallableFunction;
    getCallableFunction: (id: string) => CallableFunction;
    getCallableFunctionDisplayName: (id: string) => string;
    getCallableFunctionCode: (id: string) => string | undefined;
    dismissFunctionsWarning: () => void;
    callFunction: (
        id: string,
        args: Record<string, unknown>
    ) => Promise<unknown | undefined>;
}

const notImplemented = makeNotImplemented("CallableFunctionsContext");
export const CallableFunctionsContext =
    React.createContext<CallableFunctionsContextValue>({
        callableFunctions: [],
        showFunctionsWarning: true,

        addCallableFunction: notImplemented,
        getCallableFunction: notImplemented,
        getCallableFunctionDisplayName: notImplemented,
        getCallableFunctionCode: notImplemented,
        dismissFunctionsWarning: notImplemented,
        callFunction: notImplemented,
    });
