import { Stack, Group } from "@mantine/core";
import ApiKeyInput from "../../inputs/ApiKeyInput";
import ContextInput from "../../inputs/ContextInput";
import DisableModerationInput from "../../inputs/DisableModerationInput";
import DryInput from "../../inputs/DryInput";
import ModelSelectInput from "../../inputs/ModelSelectInput/ModelSelectInput";
import SaveInput from "../../inputs/SaveInput";
import StreamInput from "../../inputs/StreamInput";
import useConversationForm from "../../../contexts/hooks/useConversationForm";

const ConversationFormConversationTab = () => {
    const form = useConversationForm();

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
        </Stack>
    );
};

export default ConversationFormConversationTab;
