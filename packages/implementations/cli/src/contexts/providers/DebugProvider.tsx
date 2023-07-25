/* eslint-disable no-console */
import React from "react";
import { DebugContext, DebugContextValue } from "../DebugContext.js";

interface DebugProviderProps {
    children?: React.ReactNode;
}

export default ({ children }: DebugProviderProps) => {
    const [logs, setLogs] = React.useState<string[]>([]);

    const log = React.useCallback((...args: any[]) => {
        const argsStr = args.map((arg) => {
            if (typeof arg === "string") {
                return arg;
            }

            return JSON.stringify(arg);
        });

        setLogs((prevLogs) => [...prevLogs, ...argsStr]);
    }, []);

    const providerValue = React.useMemo<DebugContextValue>(
        () => ({
            logs,
            log,
        }),
        [logs, log]
    );

    React.useEffect(() => {
        const originalLog = console.log;
        const originalInfo = console.info;
        const originalWarn = console.warn;
        const originalError = console.error;
        const originalClear = console.clear;

        console.log = log;
        console.info = log;
        console.warn = log;
        console.error = log;
        console.clear = () => {
            setLogs([]);
        };
        return () => {
            console.log = originalLog;
            console.info = originalInfo;
            console.warn = originalWarn;
            console.error = originalError;
            console.clear = originalClear;
        };
    }, [log]);

    return (
        <DebugContext.Provider value={providerValue}>
            {children}
        </DebugContext.Provider>
    );
};
