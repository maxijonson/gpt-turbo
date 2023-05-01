import { Button, Stack, Text } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import React from "react";
import { ZodType } from "zod";

const warns = new Set<string>();

export default <T,>(
    key: string,
    defaultValue: T,
    schema?: ZodType<T, any, any>
) => {
    const [valueCheck] = useLocalStorage<T>({
        key: key,
    });
    const [value, setValue, removeValue] = useLocalStorage<T>({
        key: key,
        defaultValue,
    });
    const [validated, setValidated] = React.useState(false);

    const isValueLoaded =
        valueCheck !== undefined || !localStorage.getItem(key);

    React.useEffect(() => {
        if (isValueLoaded && schema && !validated) {
            const result = schema.safeParse(value);
            setValidated(true);
            if (result.success || warns.has(key)) return;
            warns.add(key);
            console.error(result.error.format());
            notifications.show({
                title: `Invalid ${key} Local Storage value`,
                message: (
                    <Stack spacing="xs">
                        <Text size="xs">
                            The value for {key} in the browser's local storage
                            is invalid or outdated. The app may not function
                            properly. It is recommended to clear the value. See
                            the console for more details.
                        </Text>
                        <Button
                            variant="subtle"
                            color="red"
                            onClick={() => {
                                removeValue();
                                window.location.reload();
                            }}
                        >
                            Remove value and reload
                        </Button>
                    </Stack>
                ),
                color: "orange",
                autoClose: false,
            });
        }
    }, [isValueLoaded, key, removeValue, schema, validated, value]);

    return {
        value,
        setValue,
        removeValue,
        isValueLoaded,
    };
};
