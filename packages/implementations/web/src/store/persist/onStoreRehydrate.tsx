import { modals } from "@mantine/modals";
import { AppState } from "..";
import { Text } from "@mantine/core";
import StorageLoadError from "../../components/error-handling/StorageLoadError";
import { STORAGE_PERSISTENCE_KEY } from "../../config/constants";
import { StoreMigrationError } from "./migrations";
import getErrorInfo from "../../utils/getErrorInfo";
import { migrateOldData } from "./migrateOldData";

export const onStoreRehydrate = (
    _state: AppState
): void | ((state?: AppState, error?: unknown) => void) => {
    return (_hydratedState, e) => {
        // TODO: Remove this after a while to give time for users to migrate to new storage
        migrateOldData();

        if (!e) return;
        const error = e as Error;
        const isMigrationError = error instanceof StoreMigrationError;
        const storageData = localStorage.getItem(STORAGE_PERSISTENCE_KEY);
        const currentData = JSON.stringify(
            JSON.parse(storageData || "{}"),
            null,
            2
        );
        const { title, message } = getErrorInfo(error);
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
                        Storage {isMigrationError ? "Migration" : "Loading"}{" "}
                        Error: {title} - {message}
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
