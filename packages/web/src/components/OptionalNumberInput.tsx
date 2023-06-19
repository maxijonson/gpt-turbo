import { NumberInput } from "@mantine/core";
import React from "react";

interface OptionalNumberInputProps {
    value: number | undefined;
    onChange: (value: number | undefined) => void;
    label: string;
    precision?: number;
    min?: number;
    step?: number;
    max?: number;
}

const OptionalNumberInput = ({
    value,
    onChange,
    label,
    precision = 2,
    min = 0,
    step = 0.05,
    max = 1,
}: OptionalNumberInputProps) => {
    const handleChange = React.useCallback(
        (v: number | "") => {
            if (v === "") {
                onChange(undefined);
            } else {
                onChange(v);
            }
        },
        [onChange]
    );
    return (
        <NumberInput
            value={value}
            onChange={handleChange}
            label={label}
            precision={precision}
            min={min}
            step={step}
            max={max}
        />
    );
};

export default OptionalNumberInput;
