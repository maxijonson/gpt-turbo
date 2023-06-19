import { Tooltip, Input, Switch } from "@mantine/core";

interface DryInputProps {
    value: boolean;
    onChange: (value: boolean) => void;
    readOnly?: boolean;
}

const DryInput = ({ value, onChange, readOnly }: DryInputProps) => {
    return (
        <Tooltip
            label="Dry mode is enabled when no API key is specified"
            disabled={!readOnly}
        >
            <Input.Wrapper label="Dry">
                <Switch
                    onChange={(event) => onChange(event.currentTarget.checked)}
                    checked={value}
                    readOnly={readOnly}
                />
            </Input.Wrapper>
        </Tooltip>
    );
};

export default DryInput;
