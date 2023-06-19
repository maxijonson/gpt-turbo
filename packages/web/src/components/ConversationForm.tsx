import React from "react";
import { useForm } from "@mantine/form";
import {
    Group,
    Stack,
    Text,
    Button,
    Divider,
    Collapse,
    TextInput,
    Grid,
    Tabs,
} from "@mantine/core";
import useSettings from "../hooks/useSettings";
import ModelSelectInput from "./ModelSelectInput";
import DisableModerationInput from "./DisableModerationInput";
import { CreateChatCompletionRequest, RequestOptionsProxy } from "gpt-turbo";
import ApiKeyInput from "./ApiKeyInput";
import DryInput from "./DryInput";
import StreamInput from "./StreamInput";
import SaveInput from "./SaveInput";
import ContextInput from "./ContextInput";
import OptionalNumberInput from "./OptionalNumberInput";
import StopInput from "./StopInput";
import LogitBiasInput from "./LogitBiasInput";
import HeadersInput from "./HeadersInput";
import ProxyInput from "./ProxyInput";

export interface ConversationFormValues {
    save: boolean;

    apiKey: string;
    model: string;
    context: string;
    dry: boolean;
    disableModeration: boolean | "soft";
    stream: boolean;

    temperature: CreateChatCompletionRequest["temperature"];
    top_p: CreateChatCompletionRequest["top_p"];
    frequency_penalty: CreateChatCompletionRequest["frequency_penalty"];
    presence_penalty: CreateChatCompletionRequest["presence_penalty"];
    stop: CreateChatCompletionRequest["stop"];
    max_tokens: CreateChatCompletionRequest["max_tokens"];
    logit_bias: CreateChatCompletionRequest["logit_bias"];
    user: CreateChatCompletionRequest["user"];

    headers: Record<string, string> | undefined;
    proxy: RequestOptionsProxy | undefined;
}

interface ConversationFormProps {
    onSubmit: (values: ConversationFormValues) => void;
}

const ConversationForm = ({ onSubmit }: ConversationFormProps) => {
    const { settings } = useSettings();
    const form = useForm({
        initialValues: {
            save: settings.save,

            apiKey: settings.apiKey,
            model: settings.model,
            context: settings.context,
            dry: settings.dry,
            disableModeration: settings.disableModeration,
            stream: settings.stream,

            temperature: settings.temperature,
            top_p: settings.top_p,
            frequency_penalty: settings.frequency_penalty,
            presence_penalty: settings.presence_penalty,
            stop: settings.stop,
            max_tokens: settings.max_tokens,
            logit_bias: settings.logit_bias,
            user: settings.user,

            headers: settings.headers,
            proxy: settings.proxy,
        },
        transformValues: (values): ConversationFormValues => ({
            ...values,
            user: values.user === "" ? undefined : values.user,
            dry: !values.apiKey || values.dry,
        }),
    });
    const [showAdvanced, setShowAdvanced] = React.useState(false);

    const handleSubmit = form.onSubmit((values) => {
        onSubmit(values);
    });

    return (
        <form onSubmit={handleSubmit}>
            <Stack>
                <Tabs defaultValue="conversation">
                    <Tabs.List>
                        <Tabs.Tab value="conversation">Conversation</Tabs.Tab>
                        <Tabs.Tab value="request">Request</Tabs.Tab>
                    </Tabs.List>
                    <Tabs.Panel value="conversation">
                        <Stack>
                            <ApiKeyInput {...form.getInputProps("apiKey")} />
                            <Group>
                                <ModelSelectInput
                                    {...form.getInputProps("model")}
                                />
                                <Group position="center" sx={{ flexGrow: 1 }}>
                                    <DisableModerationInput
                                        {...form.getInputProps(
                                            "disableModeration"
                                        )}
                                    />
                                </Group>
                                <Group
                                    position="center"
                                    noWrap
                                    sx={{ flexGrow: 1 }}
                                >
                                    <DryInput
                                        {...form.getInputProps("dry")}
                                        value={
                                            !form.values.apiKey ||
                                            form.values.dry
                                        }
                                        readOnly={!form.values.apiKey}
                                    />
                                    <StreamInput
                                        {...form.getInputProps("stream")}
                                    />
                                    <SaveInput
                                        {...form.getInputProps("save")}
                                    />
                                </Group>
                            </Group>
                            <ContextInput {...form.getInputProps("context")} />
                            <Divider
                                labelPosition="center"
                                label={
                                    <Button
                                        variant="subtle"
                                        onClick={() =>
                                            setShowAdvanced(!showAdvanced)
                                        }
                                        w={200}
                                    >
                                        {showAdvanced ? "Hide" : "Show"}{" "}
                                        Advanced Settings
                                    </Button>
                                }
                            />
                            <Collapse in={showAdvanced}>
                                <Grid align="end">
                                    <Grid.Col span={4}>
                                        <OptionalNumberInput
                                            {...form.getInputProps(
                                                "max_tokens"
                                            )}
                                            label="Max Tokens"
                                            step={1}
                                            precision={0}
                                            min={1}
                                            max={Infinity}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={4}>
                                        <TextInput
                                            {...form.getInputProps("user")}
                                            value={form.values.user || ""}
                                            label="User"
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={4}>
                                        <OptionalNumberInput
                                            {...form.getInputProps(
                                                "temperature"
                                            )}
                                            label="Temperature"
                                            max={2}
                                        />
                                    </Grid.Col>
                                </Grid>
                                <Grid align="end">
                                    <Grid.Col span={4}>
                                        <OptionalNumberInput
                                            {...form.getInputProps(
                                                "frequency_penalty"
                                            )}
                                            label="Frequency Penalty"
                                            min={-2}
                                            max={2}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={4}>
                                        <OptionalNumberInput
                                            {...form.getInputProps(
                                                "presence_penalty"
                                            )}
                                            label="Presence Penalty"
                                            min={-2}
                                            max={2}
                                        />
                                    </Grid.Col>
                                    <Grid.Col span={4}>
                                        <OptionalNumberInput
                                            {...form.getInputProps("top_p")}
                                            label="Top P"
                                        />
                                    </Grid.Col>
                                </Grid>
                                <StopInput {...form.getInputProps("stop")} />
                                <LogitBiasInput
                                    {...form.getInputProps("logit_bias")}
                                />
                            </Collapse>
                        </Stack>
                    </Tabs.Panel>
                    <Tabs.Panel value="request">
                        <ProxyInput {...form.getInputProps("proxy")} />
                        <HeadersInput {...form.getInputProps("headers")} />
                    </Tabs.Panel>
                </Tabs>
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

export default ConversationForm;
