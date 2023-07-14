import React from "react";
import { useGetFunction } from "./useGetFunction";
import { useGetFunctionDisplayName } from "./useGetFunctionDisplayName";
import { useGetFunctionCode } from "./useGetFunctionCode";
import { randomId } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { BiCheck, BiX } from "react-icons/bi";
import getErrorInfo from "../../../utils/getErrorInfo";

export const useCallFunction = () => {
    const getFunction = useGetFunction();
    const getDisplayName = useGetFunctionDisplayName();
    const getCode = useGetFunctionCode();

    return React.useCallback(
        async (id: string, args: Record<string, unknown>) => {
            const callableFunction = getFunction(id);
            if (!callableFunction) return undefined;

            const code = getCode(id);
            if (!code) return undefined;

            const displayName = getDisplayName(id) ?? "[N/A]";

            try {
                const { argNames, argValues } =
                    callableFunction.parameters.reduce(
                        (acc, param) => {
                            acc.argNames.push(param.name);
                            acc.argValues.push(args[param.name] ?? undefined);
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
        [getCode, getDisplayName, getFunction]
    );
};
