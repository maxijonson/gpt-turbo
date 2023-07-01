import React from "react";
import {
    CallableFunctionsContext,
    CallableFunctionsContextValue,
} from "../CallableFunctionsContext";
import { CallableFunction } from "gpt-turbo";
import { notifications } from "@mantine/notifications";
import { randomId, useDisclosure } from "@mantine/hooks";
import { BiCheck, BiX } from "react-icons/bi";
import getErrorInfo from "../../utils/getErrorInfo";

interface CallableFunctionsProviderProps {
    children?: React.ReactNode;
}

const CallableFunctionsProvider = ({
    children,
}: CallableFunctionsProviderProps) => {
    const [functionDisplayNames, setFunctionDisplayNames] = React.useState<{
        [id: string]: string;
    }>({});
    const [functionCodes, setFunctionCodes] = React.useState<{
        [id: string]: string;
    }>({});
    const [showFunctionsWarning, { close: dismissFunctionsWarning }] =
        useDisclosure(true);
    const [
        showFunctionsImportWarning,
        { close: dismissFunctionsImportWarning },
    ] = useDisclosure(true);
    const [callableFunctions, setCallableFunctions] = React.useState<
        CallableFunctionsContextValue["callableFunctions"]
    >([]);

    const addCallableFunction = React.useCallback<
        CallableFunctionsContextValue["addCallableFunction"]
    >((config, displayName, code) => {
        const callableFunction =
            config instanceof CallableFunction
                ? config
                : CallableFunction.fromJSON(config);

        setCallableFunctions((callableFunctions) =>
            callableFunctions
                .filter((fn) => fn.id !== callableFunction.id)
                .concat(callableFunction)
        );
        setFunctionDisplayNames((functionDisplayNames) => ({
            ...functionDisplayNames,
            [callableFunction.id]: displayName,
        }));
        if (code !== undefined) {
            setFunctionCodes((functionCodes) => ({
                ...functionCodes,
                [callableFunction.id]: code,
            }));
        }

        return callableFunction;
    }, []);

    const getCallableFunction = React.useCallback<
        CallableFunctionsContextValue["getCallableFunction"]
    >(
        (id) => {
            const callableFunction = callableFunctions.find(
                (fn) => fn.id === id
            );
            if (callableFunction === undefined) {
                throw new Error(`No callable function found with id "${id}"`);
            }
            return callableFunction;
        },
        [callableFunctions]
    );

    const getCallableFunctionDisplayName = React.useCallback<
        CallableFunctionsContextValue["getCallableFunctionDisplayName"]
    >(
        (id) => {
            const displayName = functionDisplayNames[id];
            if (displayName === undefined) {
                throw new Error(
                    `No display name found for callable function with id "${id}"`
                );
            }
            return displayName;
        },
        [functionDisplayNames]
    );

    const getCallableFunctionCode = React.useCallback<
        CallableFunctionsContextValue["getCallableFunctionCode"]
    >(
        (id) => {
            return functionCodes[id];
        },
        [functionCodes]
    );

    const callFunction = React.useCallback<
        CallableFunctionsContextValue["callFunction"]
    >(
        async (id, args) => {
            const callableFunction = getCallableFunction(id);
            const displayName = getCallableFunctionDisplayName(id);

            const code = getCallableFunctionCode(id);
            if (!code) return undefined;

            try {
                const { argNames, argValues } =
                    callableFunction.parameters.reduce(
                        (acc, fn) => {
                            acc.argNames.push(fn.name);
                            acc.argValues.push(args[fn.name] ?? undefined);
                            return acc;
                        },
                        {
                            argNames: [],
                            argValues: [],
                        } as { argNames: string[]; argValues: any[] }
                    );
                const fn = new Function(...argNames, code);

                const result = fn(...argValues);

                if (result instanceof Promise) {
                    const notifId = randomId();
                    notifications.show({
                        id: notifId,
                        loading: true,
                        title: "Function Call",
                        message: `Calling ${displayName}...`,
                        autoClose: false,
                        withCloseButton: false,
                    });

                    try {
                        const awaited = await result;

                        notifications.update({
                            id: notifId,
                            color: "green",
                            title: "Function Call Success",
                            message: `${displayName} called successfully!`,
                            icon: <BiCheck />,
                            autoClose: 2000,
                        });

                        return awaited;
                    } catch (e) {
                        notifications.hide(notifId);
                        throw e;
                    }
                }

                return result;
            } catch (e) {
                console.error(e);
                const { message } = getErrorInfo(e);
                notifications.show({
                    color: "red",
                    title: "Function Call Failed",
                    message: `${displayName} failed: ${message}`,
                    icon: <BiX />,
                    autoClose: false,
                    withCloseButton: true,
                });
                return undefined;
            }
        },
        [
            getCallableFunction,
            getCallableFunctionCode,
            getCallableFunctionDisplayName,
        ]
    );

    const deleteCallableFunction = React.useCallback<
        CallableFunctionsContextValue["deleteCallableFunction"]
    >((id) => {
        setCallableFunctions((callableFunctions) =>
            callableFunctions.filter((fn) => fn.id !== id)
        );
        setFunctionDisplayNames((functionDisplayNames) => {
            const { [id]: _, ...rest } = functionDisplayNames;
            return rest;
        });
        setFunctionCodes((functionCodes) => {
            const { [id]: _, ...rest } = functionCodes;
            return rest;
        });
    }, []);

    const providerValue = React.useMemo<CallableFunctionsContextValue>(
        () => ({
            callableFunctions,
            showFunctionsWarning,
            showFunctionsImportWarning,
            addCallableFunction,
            getCallableFunction,
            getCallableFunctionDisplayName,
            getCallableFunctionCode,
            dismissFunctionsWarning,
            dismissFunctionsImportWarning,
            callFunction,
            deleteCallableFunction,
        }),
        [
            callableFunctions,
            showFunctionsWarning,
            showFunctionsImportWarning,
            addCallableFunction,
            getCallableFunction,
            getCallableFunctionCode,
            getCallableFunctionDisplayName,
            dismissFunctionsWarning,
            dismissFunctionsImportWarning,
            callFunction,
            deleteCallableFunction,
        ]
    );

    return (
        <CallableFunctionsContext.Provider value={providerValue}>
            {children}
        </CallableFunctionsContext.Provider>
    );
};

export default CallableFunctionsProvider;
