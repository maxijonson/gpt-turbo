import { modals } from "@mantine/modals";
import { AppState } from "..";
import { Text } from "@mantine/core";
import StorageLoadError from "../../components/StorageLoadError";
import { STORAGE_PERSISTENCE_KEY } from "../../config/constants";
import { StoreMigrationError } from "./migrations";

export const onStoreRehydrate = (
    _state: AppState
): void | ((state?: AppState, error?: unknown) => void) => {
    return (_hydratedState, e) => {
        if (!e) return;
        const error = e as Error;
        const isMigrationError = error instanceof StoreMigrationError;
        const storageData = localStorage.getItem(STORAGE_PERSISTENCE_KEY);
        const currentData = JSON.stringify(
            JSON.parse(storageData || "{}"),
            null,
            2
        );
        // HACK: Wait for Mantine to be ready
        setTimeout(() => {
            modals.open({
                id: "store-rehydrate-error",
                closeOnEscape: false,
                withCloseButton: false,
                closeOnClickOutside: false,
                centered: true,
                size: "xl",
                title: (
                    <Text color="red" size="xl" weight="bold">
                        Storage Loading Error:{" "}
                        {isMigrationError ? "Migration Failed" : error.message}
                    </Text>
                ),
                children: (
                    <StorageLoadError
                        error={error}
                        currentData={currentData}
                        isMigrationError={isMigrationError}
                    />
                ),
            });
        }, 100);

        if (storageData) {
            console.info(currentData);
        }

        if (!isMigrationError) {
            console.error(error);
        }
    };
};
