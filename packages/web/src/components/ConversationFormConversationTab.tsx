import {
    Stack,
    Group,
    Divider,
    Button,
    Collapse,
    Grid,
    TextInput,
} from "@mantine/core";
import useConversationForm from "../hooks/useConversationForm";
import ApiKeyInput from "./ApiKeyInput";
import ContextInput from "./ContextInput";
import DisableModerationInput from "./DisableModerationInput";
import DryInput from "./DryInput";
import LogitBiasInput from "./LogitBiasInput";
import ModelSelectInput from "./ModelSelectInput";
import OptionalNumberInput from "./OptionalNumberInput";
import SaveInput from "./SaveInput";
import StopInput from "./StopInput";
import StreamInput from "./StreamInput";
import React from "react";

const ConversationFormConversationTab = () => {
    const form = useConversationForm();
    const [showAdvanced, setShowAdvanced] = React.useState(false);

    return (
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
            <Divider
                labelPosition="center"
                label={
                    <Button
                        variant="subtle"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        w={200}
                    >
                        {showAdvanced ? "Hide" : "Show"} Advanced Settings
                    </Button>
                }
            />
            <Collapse in={showAdvanced}>
                <Grid align="end">
                    <Grid.Col span={4}>
                        <OptionalNumberInput
                            {...form.getInputProps("max_tokens")}
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
                            {...form.getInputProps("temperature")}
                            label="Temperature"
                            max={2}
                        />
                    </Grid.Col>
                </Grid>
                <Grid align="end">
                    <Grid.Col span={4}>
                        <OptionalNumberInput
                            {...form.getInputProps("frequency_penalty")}
                            label="Frequency Penalty"
                            min={-2}
                            max={2}
                        />
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <OptionalNumberInput
                            {...form.getInputProps("presence_penalty")}
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
                <LogitBiasInput {...form.getInputProps("logit_bias")} />
            </Collapse>
        </Stack>
    );
};

export default ConversationFormConversationTab;
