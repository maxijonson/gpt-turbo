import { PasswordInput, Anchor } from "@mantine/core";

interface ApiKeyInputProps {
    value: string;
    onChange: (value: string) => void;
}

const ApiKeyInput = ({ value, onChange }: ApiKeyInputProps) => {
    return (
        <PasswordInput
            value={value || ""}
            onChange={(event) => onChange(event.currentTarget.value)}
            label="OpenAI API Key"
            description={
                <Anchor
                    href="https://platform.openai.com/account/api-keys"
                    target="_blank"
                >
                    Go to OpenAI API Keys
                </Anchor>
            }
        />
    );
};

export default ApiKeyInput;
