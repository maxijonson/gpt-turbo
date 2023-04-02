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
                    <Text size="xs" color="gray" italic align="center">
                        These settings will be saved to your browser's local
                        storage, including your API key, if specified. Make sure
                        that you trust the device you are using and that you are
                        not using a shared device.
                    </Text>
                </Stack>
            </form>
        </Container>
    );
};
