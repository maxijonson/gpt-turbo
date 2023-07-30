import { modals } from "@mantine/modals";
import { Text } from "@mantine/core";
import { createAction } from "../createAction";

export const deleteCallableFunction = createAction(
    async ({ set, get }, id: string, showConfirm = true) => {
        const { callableFunctions, callableFunctionDisplayNames } = get();

        const fn = callableFunctions.find((fn) => fn.id === id);
        if (!fn) return false;

        const displayName = callableFunctionDisplayNames[fn.id] ?? "[N/A]";

        const onConfirm = () => {
            set((state) => {
                state.callableFunctions = state.callableFunctions.filter(
                    (f) => f.id !== id
                );
                delete state.callableFunctionDisplayNames[id];
                delete state.callableFunctionCodes[id];
            });
        };

        if (!showConfirm) {
            onConfirm();
            return true;
        }

        return new Promise<boolean>((resolve) => {
            modals.openConfirmModal({
                title: `Delete ${displayName}?`,
                centered: true,
                children: (
                    <Text size="sm">
                        Are you sure you want to delete {displayName}? This
                        cannot be undone.
                    </Text>
                ),
                labels: { confirm: "Delete function", cancel: "Cancel" },
                confirmProps: { color: "red" },
                onConfirm: () => {
                    onConfirm();
                    resolve(true);
                },
                onClose: () => resolve(false),
            });
        });
    },
    "deleteCallableFunction"
);
