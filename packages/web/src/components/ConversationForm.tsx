import { Stack, Text, Button, Tabs } from "@mantine/core";
import ConversationFormProvider, {
    ConversationFormProviderProps,
} from "../contexts/providers/ConversationFormProvider";
import ConversationFormConversationTab from "./ConversationFormConversationTab";
import ConversationFormRequestTab from "./ConversationFormRequestTab";
import ConversationFormFunctionsTab from "./ConversationFormFunctionsTab";
import useConversationForm from "../hooks/useConversationForm";

interface ConversationFormProps {
    onSubmit: ConversationFormProviderProps["onSubmit"];
}

const ConversationFormProvided = () => {
    const form = useConversationForm();

    return (
        <Stack>
            <Tabs defaultValue="conversation">
                <Tabs.List>
                    <Tabs.Tab value="conversation">Conversation</Tabs.Tab>
                    <Tabs.Tab value="request">Request</Tabs.Tab>
                    <Tabs.Tab value="functions">Functions</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="conversation">
                    <ConversationFormConversationTab />
                </Tabs.Panel>
                <Tabs.Panel value="request">
                    <ConversationFormRequestTab />
                </Tabs.Panel>
                <Tabs.Panel value="functions">
                    <ConversationFormFunctionsTab />
                </Tabs.Panel>
            </Tabs>
            <Button type="submit">Submit</Button>
            {form.values.save && (
                <Text size="xs" italic align="center">
                    This conversation will be saved to your browser's local
                    storage, along with your API key, if specified. Make sure
                    that you trust the device you are using and that you are not
                    using a shared device.
                </Text>
            )}
        </Stack>
    );
};

const ConversationForm = ({ onSubmit }: ConversationFormProps) => (
    <ConversationFormProvider onSubmit={onSubmit}>
        <ConversationFormProvided />
    </ConversationFormProvider>
);

export default ConversationForm;
