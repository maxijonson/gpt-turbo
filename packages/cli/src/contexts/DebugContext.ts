import React from "react";
import makeNotImplemented from "../utils/makeNotImplemented.js";

export interface DebugContextValue {
    log: (...args: any[]) => void;
    logs: string[];
}

const notImplemented = makeNotImplemented("DebugContext");

export const DebugContext = React.createContext<DebugContextValue>({
    log: notImplemented,
    logs: [],
});
