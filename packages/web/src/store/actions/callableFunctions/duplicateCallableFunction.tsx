import { Text } from "@mantine/core";
import { useAppStore } from "../..";
import { modals } from "@mantine/modals";
import { addCallableFunction } from "./addCallableFunction";

export const duplicateCallableFunction = (id: string, withConfirm = true) => {
    const {
        callableFunctions,
        callableFunctionDisplayNames,
        callableFunctionCodes,
    } = useAppStore.getState();

    const fn = callableFunctions.find((fn) => fn.id === id);
    if (!fn) return;

    const displayName = callableFunctionDisplayNames[fn.id];
    if (!displayName) return;

    const code = callableFunctionCodes[fn.id];

    const copyDisplayName = (() => {
        let i = 1;
        let copy = `${displayName} (${i})`;
        while (
            callableFunctions.some(
                (fn) => callableFunctionDisplayNames[fn.id] === copy
            )
        ) {
            copy = `${displayName} (${i++})`;
        }
        return copy;
    })();

    const copyName = (() => {
        let i = 1;
        let copy = `${fn.name}${i}`;
        while (callableFunctions.some((fn) => fn.name === copy)) {
            copy = `${fn.name}${i++}`;
        }
        return copy;
    })();

    const onConfirm = () => {
        addCallableFunction(
            {
                ...fn.toJSON(),
                id: undefined,
                name: copyName,
            },
            copyDisplayName,
            code
        );
    };

    if (!withConfirm) return onConfirm();

    modals.openConfirmModal({
        title: `Duplicate ${displayName}?`,
        centered: true,
        children: (
            <Text size="sm">
                This will create a new function with the same config and code,
                but the display name and function name will appear as{" "}
                <Text span weight="bold">
                    {copyDisplayName}
                </Text>{" "}
                and{" "}
                <Text span weight="bold">
                    {copyName}
                </Text>
            </Text>
        ),
        labels: { confirm: "Duplicate function", cancel: "Cancel" },
        onConfirm,
    });
};
