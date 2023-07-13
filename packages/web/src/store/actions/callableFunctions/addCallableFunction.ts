import { CallableFunction, CallableFunctionModel } from "gpt-turbo";
import { useAppStore } from "../..";

export const addCallableFunction = (
    config: CallableFunction | CallableFunctionModel,
    displayName: string,
    code?: string
) => {
    const callableFunction =
        config instanceof CallableFunction
            ? config
            : CallableFunction.fromJSON(config);

    useAppStore.setState((state) => {
        state.callableFunctions = state.callableFunctions
            .filter((f) => f.id !== callableFunction.id)
            .concat(callableFunction);

        state.callableFunctionDisplayNames[callableFunction.id] = displayName;

        if (code) {
            state.callableFunctionCodes[callableFunction.id] = code;
        } else if (state.callableFunctionCodes[callableFunction.id]) {
            delete state.callableFunctionCodes[callableFunction.id];
        }
    });

    return callableFunction;
};
