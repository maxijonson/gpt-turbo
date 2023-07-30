import { Input, SegmentedControl } from "@mantine/core";
import React from "react";

interface OptionalBooleanInputProps {
    value: boolean | undefined;
    onChange: (value: boolean | undefined) => void;
    label: string;
}

const OptionalBooleanInput = ({
    value,
    onChange,
    label,
}: OptionalBooleanInputProps) => {
    const handleChange = React.useCallback(
        (v: "true" | "false" | "undefined") => {
            switch (v) {
                case "true":
                    onChange(true);
                    break;
                case "false":
                    onChange(false);
                    break;
                case "undefined":
                    onChange(undefined);
                    break;
            }
        },
        [onChange]
    );

    const segmentedValue = React.useMemo(() => {
        if (value === undefined) return "undefined";
        return value ? "true" : "false";
    }, [value]);

    return (
        <Input.Wrapper label={label}>
            <SegmentedControl
                value={segmentedValue}
                onChange={handleChange}
                data={[
                    { label: "N/A", value: "undefined" },
                    { label: "True", value: "true" },
                    { label: "False", value: "false" },
                ]}
            />
        </Input.Wrapper>
    );
};

export default OptionalBooleanInput;
