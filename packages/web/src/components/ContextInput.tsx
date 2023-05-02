import { Textarea } from "@mantine/core";

interface ContextInputProps {
    value: string;
    onChange: (value: string) => void;
}

export default ({ value, onChange }: ContextInputProps) => {
    return (
        <Textarea
            value={value}
            onChange={(event) => onChange(event.currentTarget.value)}
            autosize
            minRows={3}
            maxRows={5}
            label="Context"
        />
    );
};
