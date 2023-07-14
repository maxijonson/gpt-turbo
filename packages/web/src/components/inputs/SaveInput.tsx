import { Input, Switch } from "@mantine/core";

interface SaveInputProps {
    value: boolean;
    onChange: (value: boolean) => void;
}

const SaveInput = ({ value, onChange }: SaveInputProps) => {
    return (
        <Input.Wrapper label="Save">
            <Switch
                onChange={(event) => onChange(event.currentTarget.checked)}
                checked={value}
            />
        </Input.Wrapper>
    );
};

export default SaveInput;
