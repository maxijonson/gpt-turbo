import { TextInput, TextInputProps } from "@mantine/core";
import React from "react";

type OptionalTextInputProps = TextInputProps & {
    value: string | undefined;
    onChange: (value: string | undefined) => void;
};

const OptionalTextInput = ({
    value,
    onChange,
    ...textInputProps
}: OptionalTextInputProps) => {
    const handleChange = React.useCallback(
        (v: string | "") => {
            if (v === "") {
                onChange(undefined);
            } else {
                onChange(v);
            }
        },
        [onChange]
    );
    return (
        <TextInput
            {...textInputProps}
            value={value ?? ""}
            onChange={(v) => handleChange(v.currentTarget.value)}
        />
    );
};

export default OptionalTextInput;
