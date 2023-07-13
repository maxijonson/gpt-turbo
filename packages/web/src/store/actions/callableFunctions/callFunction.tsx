import { notifications } from "@mantine/notifications";
import { randomId } from "@mantine/hooks";
import { BiCheck, BiX } from "react-icons/bi";
import getErrorInfo from "../../../utils/getErrorInfo";
import { useAppStore } from "../..";

export const callFunction = async (
    id: string,
    args: Record<string, unknown>
) => {
    const callableFunction = useAppStore
        .getState()
        .callableFunctions.find((fn) => fn.id === id);

    if (!callableFunction) {
        throw new Error(`Function ${id} not found`);
    }

    const displayName =
        useAppStore.getState().callableFunctionDisplayNames[id] ??
        "Unknown Function";

    const code = useAppStore.getState().callableFunctionCodes[id];
    if (!code) return undefined;

    try {
        const { argNames, argValues } = callableFunction.parameters.reduce(
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
};
