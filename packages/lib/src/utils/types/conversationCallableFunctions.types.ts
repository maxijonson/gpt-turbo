import { CallableFunction } from "../../classes/CallableFunction.js";

export type AddCallableFunctionListener = (
    /**
     * The {@link CallableFunction callable function} that was added
     */
    callableFunction: CallableFunction
) => void;

export type RemoveCallableFunctionListener = (
    /**
     * The {@link CallableFunction callable function} that was removed
     */
    callableFunction: CallableFunction
) => void;
