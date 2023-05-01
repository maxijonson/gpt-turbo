import React from "react";
import { useForm } from "@mantine/form";
import {
    Group,
    PasswordInput,
    Stack,
    Text,
    Switch,
    Input,
    Button,
    Textarea,
    Tooltip,
    Anchor,
} from "@mantine/core";
import useSettings from "../hooks/useSettings";
import ModelSelectInput from "./ModelSelectInput";
import DisableModerationInput from "./DisableModerationInput";

export interface ConversationFormValues {
    apiKey: string;
    model: string;
    context: string;
    dry: boolean;
    disableModeration: boolean | "soft";
    stream: boolean;
    save: boolean;
}

interface ConversationFormProps {
    onSubmit: (values: ConversationFormValues) => void;
}

export default ({ onSubmit }: ConversationFormProps) => {
    const { settings } = useSettings();
    const form = useForm({
        initialValues: {
            apiKey: settings.apiKey,
            model: settings.model,
            context: settings.context,
            dry: settings.dry,
            disableModeration: settings.disableModeration,
            stream: settings.stream,
            save: settings.save,
        },
        transformValues: (values): ConversationFormValues => ({
            ...values,
            dry: !values.apiKey || values.dry,
        }),
    });

    const handleSubmit = form.onSubmit((values) => {
        onSubmit(values);
    });

    return (
        <form onSubmit={handleSubmit}>
            <Stack>
                <PasswordInput
                    {...form.getInputProps("apiKey")}
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
                <Group>
                    <ModelSelectInput {...form.getInputProps("model")} />
                    <Group position="center" sx={{ flexGrow: 1 }}>
                        <DisableModerationInput
                            {...form.getInputProps("disableModeration")}
                        />
                    </Group>
                    <Group position="center" noWrap sx={{ flexGrow: 1 }}>
                        <Tooltip
                            label="Dry mode is enabled when no API key is specified"
                            disabled={!!form.values.apiKey}
                        >
                            <Input.Wrapper label="Dry">
                                <Switch
                                    {...form.getInputProps("dry")}
                                    checked={
                                        !form.values.apiKey || form.values.dry
                                    }
                                    readOnly={!form.values.apiKey}
                                />
                            </Input.Wrapper>
                        </Tooltip>
                        <Input.Wrapper label="Stream">
                            <Switch
                                {...form.getInputProps("stream", {
                                    type: "checkbox",
                                })}
                            />
                        </Input.Wrapper>
                        <Input.Wrapper label="Save">
                            <Switch
                                {...form.getInputProps("save", {
                                    type: "checkbox",
                                })}
                            />
                        </Input.Wrapper>
                    </Group>
                </Group>
                <Textarea
                    {...form.getInputProps("context")}
                    autosize
                    minRows={3}
                    maxRows={5}
                    label="Context"
                />
                <Button type="submit">Submit</Button>
                {form.values.save && (
                    <Text size="xs" italic align="center">
                        This conversation will be saved to your browser's local
                        storage, along with your API key, if specified. Make
                        sure that you trust the device you are using and that
                        you are not using a shared device.
                    </Text>
                )}
            </Stack>
        </form>
    );
};
