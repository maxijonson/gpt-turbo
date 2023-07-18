import { Stack, Text, Button, Tabs, Box, Group } from "@mantine/core";
import ConversationFormProvider, {
    ConversationFormProviderProps,
} from "../../../contexts/providers/ConversationFormProvider";
import ConversationFormConversationTab from "./ConversationFormConversationTab";
import ConversationFormAdvancedTab from "./ConversationFormAdvancedTab";
import ConversationFormRequestTab from "./ConversationFormRequestTab";
import ConversationFormFunctionsTab from "./ConversationFormFunctionsTab";
import React from "react";
import useConversationForm from "../../../contexts/hooks/useConversationForm";
import TippedActionIcon from "../../common/TippedActionIcon";
import { BiSave } from "react-icons/bi";
import { useAppStore } from "../../../store";
import { setDefaultSettings } from "../../../store/actions/defaultConversationSettings/setDefaultSettings";
import { notifications } from "@mantine/notifications";

interface ConversationFormProvidedProps {
    subimitLabel?: string;
}

type ConversationFormProps = ConversationFormProvidedProps &
    Omit<ConversationFormProviderProps, "children">;

type ConversationFormTab =
    | "conversation"
    | "advanced"
    | "request"
    | "functions";

const ConversationFormProvided = ({
    subimitLabel = "Create Conversation",
}: ConversationFormProvidedProps) => {
    const form = useConversationForm();
    const [currentTab, setCurrentTab] =
        React.useState<ConversationFormTab>("conversation");
    const settings = useAppStore((state) => state.defaultSettings);

    const onSetDefaultSettings = React.useCallback(() => {
        const { hasErrors } = form.validate();
        if (hasErrors) return;

        setDefaultSettings({
            ...settings,
            ...form.getTransformedValues(),
        });
        notifications.show({
            message: "Default settings saved",
            color: "green",
        });
    }, [form, settings]);

    return (
        <Stack justify="space-between" h="100%">
            <Tabs
                keepMounted={false}
                value={currentTab}
                onTabChange={(tab) =>
                    setCurrentTab(
                        (tab as ConversationFormTab) ?? "conversation"
                    )
                }
            >
                <Tabs.List>
                    <Tabs.Tab value="conversation">Conversation</Tabs.Tab>
                    <Tabs.Tab value="advanced">Advanced</Tabs.Tab>
                    <Tabs.Tab value="functions">Functions</Tabs.Tab>
                    <Tabs.Tab value="request">Request</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="conversation" pt="md">
                    <ConversationFormConversationTab />
                </Tabs.Panel>
                <Tabs.Panel value="advanced" pt="md">
                    <ConversationFormAdvancedTab />
                </Tabs.Panel>
                <Tabs.Panel value="functions" pt="md">
                    <ConversationFormFunctionsTab />
                </Tabs.Panel>
                <Tabs.Panel value="request" pt="md">
                    <ConversationFormRequestTab />
                </Tabs.Panel>
            </Tabs>
            <Box>
                <Group noWrap>
                    <Button type="submit" fullWidth>
                        {subimitLabel}
                    </Button>
                    <TippedActionIcon
                        withinPortal
                        size="lg"
                        variant="outline"
                        tip="Save as default settings"
                        onClick={onSetDefaultSettings}
                    >
                        <BiSave />
                    </TippedActionIcon>
                </Group>
                {form.values.save && (
                    <Text size="xs" italic align="center">
                        This conversation will be saved to your browser's local
                        storage. Make sure the device you're using is trusted
                        and not shared with anyone else.
                    </Text>
                )}
            </Box>
        </Stack>
    );
};

const ConversationForm = ({
    onSubmit,
    conversationId,
    ...conversationFormProvidedProps
}: ConversationFormProps) => (
    <ConversationFormProvider
        onSubmit={onSubmit}
        conversationId={conversationId}
    >
        <ConversationFormProvided {...conversationFormProvidedProps} />
    </ConversationFormProvider>
);

export default ConversationForm;
