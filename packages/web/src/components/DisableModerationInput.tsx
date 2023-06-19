import React from "react";
import { Input, SegmentedControl } from "@mantine/core";

interface DisableModerationInputProps {
    value: boolean | "soft";
    onChange: (value: boolean | "soft") => void;
}

const DisableModerationInput = (props: DisableModerationInputProps) => {
    const onChange = React.useCallback(
        (value: string) => {
            if (value === "soft") return props.onChange("soft");
            props.onChange(value === "off");
        },
        [props]
    );

    const value = React.useMemo(() => {
        if (props.value === "soft") return "soft";
        return props.value ? "off" : "on";
    }, [props.value]);

    return (
        <Input.Wrapper label="Moderation">
            <div>
                <SegmentedControl
                    value={value}
                    onChange={onChange}
                    color="blue"
                    data={[
                        { label: "On", value: "on" },
                        { label: "Soft", value: "soft" },
                        { label: "Off", value: "off" },
                    ]}
                />
            </div>
        </Input.Wrapper>
    );
};

export default DisableModerationInput;
