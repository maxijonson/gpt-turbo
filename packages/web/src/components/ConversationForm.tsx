import React from "react";
import { useForm } from "@mantine/form";
import { Group, Stack, Text, Button } from "@mantine/core";
import useSettings from "../hooks/useSettings";
import ModelSelectInput from "./ModelSelectInput";
import DisableModerationInput from "./DisableModerationInput";
import { CreateChatCompletionRequest } from "gpt-turbo";
import ApiKeyInput from "./ApiKeyInput";
import DryInput from "./DryInput";
import StreamInput from "./StreamInput";
import SaveInput from "./SaveInput";
import ContextInput from "./ContextInput";

export interface ConversationFormValues {
    save: boolean;

    apiKey: string;
    model: string;
    context: string;
    dry: boolean;
    disableModeration: boolean | "soft";
    stream: boolean;

    temperature?: CreateChatCompletionRequest["temperature"];
    top_p?: CreateChatCompletionRequest["top_p"];
    frequency_penalty?: CreateChatCompletionRequest["frequency_penalty"];
    presence_penalty?: CreateChatCompletionRequest["presence_penalty"];
    stop?: CreateChatCompletionRequest["stop"];
    max_tokens?: CreateChatCompletionRequest["max_tokens"];
    logit_bias?: CreateChatCompletionRequest["logit_bias"];
    user?: CreateChatCompletionRequest["user"];
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
                <ApiKeyInput {...form.getInputProps("apiKey")} />
                <Group>
                    <ModelSelectInput {...form.getInputProps("model")} />
                    <Group position="center" sx={{ flexGrow: 1 }}>
                        <DisableModerationInput
                            {...form.getInputProps("disableModeration")}
                        />
                    </Group>
                    <Group position="center" noWrap sx={{ flexGrow: 1 }}>
                        <DryInput
                            {...form.getInputProps("dry")}
                            value={!form.values.apiKey || form.values.dry}
                            readOnly={!form.values.apiKey}
                        />
                        <StreamInput {...form.getInputProps("stream")} />
                        <SaveInput {...form.getInputProps("save")} />
                    </Group>
                </Group>
                <ContextInput {...form.getInputProps("context")} />
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
