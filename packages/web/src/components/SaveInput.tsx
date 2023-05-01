import { Input, Switch } from "@mantine/core";

interface SaveInputProps {
    value: boolean;
    onChange: (value: boolean) => void;
}

export default ({ value, onChange }: SaveInputProps) => {
    return (
        <Input.Wrapper label="Save">
            <Switch
                onChange={(event) => onChange(event.currentTarget.checked)}
                checked={value}
            />
        </Input.Wrapper>
    );
};
