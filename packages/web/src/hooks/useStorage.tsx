import { Button, Stack, Text } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { ZodError, ZodType } from "zod";
import {
    STORAGEKEY_PERSISTENCE,
    STORAGEKEY_SETTINGS,
} from "../config/constants";
import { migratePersistence } from "../entities/migrations/persistence";
import { migrateSettings } from "../entities/migrations/settings";

const warns = new Set<string>();

const getNestedValue = (obj: any, path: (string | number)[]) => {
    let current = obj;
    for (const key of path) {
        if (current && current.hasOwnProperty(key)) {
            current = current[key];
        } else {
            return undefined; // Path doesn't exist
        }
    }
    return current;
};

const setNestedValue = (obj: any, value: any, path: (string | number)[]) => {
    let current = obj;
    for (let i = 0; i < path.length - 1; i++) {
        const key = path[i];
        if (current && current.hasOwnProperty(key)) {
            current = current[key];
        } else {
            current[key] = {};
            current = current[key];
        }
    }
    current[path[path.length - 1]] = value;
};

const repairValueFromZodError = <T,>(
    broken: T,
    defaultValue: T,
    error: ZodError
): T => {
    const { issues } = error;

    return issues.reduce(
        (repairedValue, issue) => {
            switch (issue.code) {
                case "invalid_type": {
                    const { path } = issue;

                    const pathValue = getNestedValue(broken, path);
                    if (pathValue !== undefined) break; // We're only interested in undefined values

                    setNestedValue(
                        repairedValue,
                        getNestedValue(defaultValue, path),
                        path
                    );
                    break;
                }
            }
            return repairedValue;
        },
        { ...broken } as T
    );
};

const getMigratedValue = (key: string, value: any) => {
    switch (key) {
        case STORAGEKEY_PERSISTENCE:
            return migratePersistence(value);
        case STORAGEKEY_SETTINGS:
            return migrateSettings(value);
    }
    return value;
};

const useStorage = <T,>(
    key: string,
    defaultValue: T,
    schema?: ZodType<T, any, any>
) => {
    const [value, setValue, removeValue] = useLocalStorage<T>({
        key: key,
        defaultValue,
        getInitialValueInEffect: false,
        serialize: (value) => {
            const migrated = getMigratedValue(
                key,
                value ? value : defaultValue
            );
            return JSON.stringify(schema?.parse(migrated) ?? migrated);
        },
        deserialize: (v) => {
            const value = getMigratedValue(key, JSON.parse(v));
            if (!schema) return value;

            const result = schema.safeParse(value);
            if (result.success) {
                return result.data;
            }
            if (warns.has(key)) return value;

            const repaired = repairValueFromZodError(
                value,
                defaultValue,
                result.error
            );

            try {
                return schema.parse(repaired);
            } catch {
                warns.add(key);
                console.error(result.error.format());
                notifications.show({
                    title: `Invalid ${key} Local Storage value`,
                    message: (
                        <Stack spacing="xs">
                            <Text size="xs">
                                The value for {key} in the browser's local
                                storage is invalid or outdated. The app may not
                                function properly. It is recommended to clear
                                the value. See the console for more details.
                            </Text>
                            <Button
                                variant="subtle"
                                color="red"
                                onClick={() => {
                                    removeValue();
                                    window.location.reload();
                                }}
                            >
                                Delete storage and reload
                            </Button>
                        </Stack>
                    ),
                    color: "orange",
                    autoClose: false,
                });
            }
            return value;
        },
    });

    return {
        value,
        setValue,
        removeValue,
    };
};

export default useStorage;
