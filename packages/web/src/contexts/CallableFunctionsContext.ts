import { CallableFunction } from "gpt-turbo";
import React from "react";
import makeNotImplemented from "../utils/makeNotImplemented";

export interface CallableFunctionsContextValue {
    getCallableFunction: (id: string) => CallableFunction;
    getCallableFunctionDisplayName: (id: string) => string;
    getCallableFunctionCode: (id: string) => string | undefined;
    callFunction: (
        id: string,
        args: Record<string, unknown>
    ) => Promise<unknown | undefined>;
}

const notImplemented = makeNotImplemented("CallableFunctionsContext");
export const CallableFunctionsContext =
    React.createContext<CallableFunctionsContextValue>({
        getCallableFunction: notImplemented,
        getCallableFunctionDisplayName: notImplemented,
        getCallableFunctionCode: notImplemented,
        callFunction: notImplemented,
    });
