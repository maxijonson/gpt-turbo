import { useLocalStorage } from "@mantine/hooks";
import React from "react";
import { ZodType } from "zod";

export default <T>(key: string, defaultValue: T, schema?: ZodType<T>) => {
    const [valueCheck] = useLocalStorage<T>({
        key: key,
    });
    const [value, setValue, removeValue] = useLocalStorage<T>({
        key: key,
        defaultValue,
    });

    const isValueLoaded =
        valueCheck !== undefined || !localStorage.getItem(key);

    React.useEffect(() => {
        if (isValueLoaded && schema) {
            try {
                schema.parse(value);
            } catch (error) {
                console.error(
                    `Invalid or outdated value for ${key} in localStorage. Removing it.`,
                    error
                );
                removeValue();
            }
        }
    }, [isValueLoaded, key, removeValue, schema, value]);

    return {
        value,
        setValue,
        removeValue,
        isValueLoaded,
    };
};
