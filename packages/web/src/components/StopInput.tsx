import React from "react";
import { MultiSelect } from "@mantine/core";

interface StopInputProps {
    value: string | string[] | null | undefined;
    onChange: (value: string[] | undefined) => void;
}

const StopInput = ({ value, onChange }: StopInputProps) => {
    const [data, setData] = React.useState([".", "6.", "11.", "Human:"]);

    const inputValue = (() => {
        if (!value) return [];
        if (typeof value === "string") return [value];
        return value;
    })();

    const handleChange = React.useCallback(
        (v: string[]) => {
            if (v.length === 0) {
                onChange(undefined);
            } else {
                onChange(v);
            }
        },
        [onChange]
    );

    return (
        <MultiSelect
            data={data}
            onChange={handleChange}
            maxSelectedValues={4}
            value={inputValue}
            label="Stop"
            searchable
            creatable
            getCreateLabel={(value) => `Add "${value}"`}
            placeholder="Up to 4 stop sequences"
            onCreate={(value) => {
                setData((current) => [...current, value]);
                return value;
            }}
        />
    );
};

export default StopInput;
