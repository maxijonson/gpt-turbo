import { PasswordInput, Anchor, Text } from "@mantine/core";

interface ApiKeyInputProps {
    value: string;
    onChange: (value: string) => void;
}

export default ({ value, onChange }: ApiKeyInputProps) => {
    return (
        <PasswordInput
            value={value || ""}
            onChange={(event) => onChange(event.currentTarget.value)}
            label="OpenAI API Key"
            description={
                <Text>
                    You can find yours{" "}
                    <Anchor
                        href="https://platform.openai.com/account/api-keys"
                        target="_blank"
                    >
                        here
                    </Anchor>
                </Text>
            }
        />
    );
};
