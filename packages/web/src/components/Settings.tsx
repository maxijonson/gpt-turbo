import {
    Button,
    Container,
    Group,
    Input,
    PasswordInput,
    SegmentedControl,
    Select,
    Stack,
    Switch,
    Text,
    Textarea,
    Tooltip,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { closeAllModals } from "@mantine/modals";
import React from "react";
import useSettings from "../hooks/useSettings";
import { ModelSelectItem } from "./AddConversationForm";

export default () => {
    const { setSettings, settings } = useSettings();
    const form = useForm({
        initialValues: {
            ...settings,
        },
    });
    const [modelOptions, setModelOptions] = React.useState([
        { label: "GPT 3.5", value: "gpt-3.5-turbo" },
        { label: "GPT 4", value: "gpt-4" },
        { label: "GPT 4 (32k)", value: "gpt-4-32k" },
    ]);
    const handleSubmit = form.onSubmit((values) => {
        setSettings(values);
        closeAllModals();
    });

    return (
        <Container>
            <form onSubmit={handleSubmit}>
                <Stack>
                    <PasswordInput
                        {...form.getInputProps("apiKey")}
                        label="OpenAI API Key"
                    />
                    <Group>
                        <Select
                            {...form.getInputProps("model")}
                            label="Model"
                            searchable
                            creatable
                            itemComponent={ModelSelectItem}
                            data={modelOptions}
                            getCreateLabel={(query) => query}
                            onCreate={(query) => {
                                const item = { value: query, label: query };
                                setModelOptions((current) => [
                                    ...current,
                                    item,
                                ]);
                                return item;
                            }}
                            sx={{ flexGrow: 1 }}
                        />
                        <Group position="center" sx={{ flexGrow: 1 }}>
                            <Input.Wrapper label="Moderation">
                                <div>
                                    <SegmentedControl
                                        {...form.getInputProps(
                                            "disableModeration"
                                        )}
                                        color="blue"
                                        data={[
                                            { label: "On", value: "on" },
                                            { label: "Soft", value: "soft" },
                                            { label: "Off", value: "off" },
                                        ]}
                                    />
                                </div>
                            </Input.Wrapper>
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
                                            !form.values.apiKey ||
                                            form.values.dry
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
                    <Button type="submit">Save</Button>
                    <Text size="xs" italic align="center">
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
