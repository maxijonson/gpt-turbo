import { Text } from "@mantine/core";
import { modals } from "@mantine/modals";
import { addCallableFunction } from "./addCallableFunction";
import getUniqueString from "../../../utils/getUniqueString";
import { createAction } from "../createAction";

export const duplicateCallableFunction = createAction(
    ({ get }, id: string, withConfirm = true) => {
        const {
            callableFunctions,
            callableFunctionDisplayNames,
            callableFunctionCodes,
        } = get();

        const fn = callableFunctions.find((fn) => fn.id === id);
        if (!fn) return;

        const displayName = callableFunctionDisplayNames[fn.id];
        if (!displayName) return;

        const copyDisplayName = getUniqueString(
            displayName,
            Object.values(callableFunctionDisplayNames),
            (displayName, i) => `${displayName} (${i})`
        );

        const copyName = getUniqueString(
            fn.name,
            callableFunctions.map((fn) => fn.name),
            (name, i) => `${name}${i}`
        );

        const onConfirm = () => {
            addCallableFunction(
                {
                    ...fn.toJSON(),
                    id: undefined,
                    name: copyName,
                },
                copyDisplayName,
                callableFunctionCodes[fn.id]
            );
        };

        if (!withConfirm) return onConfirm();

        modals.openConfirmModal({
            title: `Duplicate ${displayName}?`,
            centered: true,
            children: (
                <Text size="sm">
                    This will create a new function with the same config and
                    code, but the display name and function name will appear as{" "}
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
    },
    "duplicateCallableFunction"
);
