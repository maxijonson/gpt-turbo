import { Button, Container, PasswordInput, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import useSettings from "../hooks/useSettings";
import React from "react";

export default () => {
    const { setSettings, settings } = useSettings();
    const form = useForm({
        initialValues: {
            ...settings,
        },
    });

    const handleSubmit = form.onSubmit((values) => {
        setSettings(values);
    });

    return (
        <Container>
            <form onSubmit={handleSubmit}>
                <Stack>
                    <PasswordInput
                        {...form.getInputProps("apiKey")}
                        label="OpenAI API Key"
                    />
                    <Button type="submit">Save</Button>
                </Stack>
            </form>
            <Text align="center" italic>
                These settings are stored in your browser's local storage and
                used as default settings for new conversations.
            </Text>
        </Container>
    );
};
