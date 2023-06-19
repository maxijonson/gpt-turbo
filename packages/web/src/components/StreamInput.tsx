import { Input, Switch } from "@mantine/core";

interface StreamInputProps {
    value: boolean;
    onChange: (value: boolean) => void;
}

const StreamInput = ({ value, onChange }: StreamInputProps) => {
    return (
        <Input.Wrapper label="Stream">
            <Switch
                onChange={(event) => onChange(event.currentTarget.checked)}
                checked={value}
            />
        </Input.Wrapper>
    );
};

export default StreamInput;
