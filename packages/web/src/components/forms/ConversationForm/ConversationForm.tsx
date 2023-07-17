import { Stack, Text, Button, Tabs, Box } from "@mantine/core";
import ConversationFormProvider, {
    ConversationFormProviderProps,
} from "../../../contexts/providers/ConversationFormProvider";
import ConversationFormConversationTab from "./ConversationFormConversationTab";
import ConversationFormRequestTab from "./ConversationFormRequestTab";
import ConversationFormFunctionsTab from "./ConversationFormFunctionsTab";
import AppSettings from "../../AppSettings/AppSettings";
import React from "react";
import useConversationForm from "../../../contexts/hooks/useConversationForm";

interface ConversationFormProvidedProps {
    hideAppSettings?: boolean;
}

type ConversationFormProps = ConversationFormProvidedProps &
    Omit<ConversationFormProviderProps, "children">;

type ConversationFormTab = "conversation" | "request" | "functions" | "app";

const ConversationFormProvided = ({
    hideAppSettings = false,
}: ConversationFormProvidedProps) => {
    const form = useConversationForm();
    const [currentTab, setCurrentTab] =
        React.useState<ConversationFormTab>("conversation");

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
                    <Tabs.Tab value="request">Request</Tabs.Tab>
                    <Tabs.Tab value="functions">Functions</Tabs.Tab>
                    {!hideAppSettings && (
                        <Tabs.Tab value="app">App Settings</Tabs.Tab>
                    )}
                </Tabs.List>
                <Tabs.Panel value="conversation" pt="md">
                    <ConversationFormConversationTab />
                </Tabs.Panel>
                <Tabs.Panel value="request" pt="md">
                    <ConversationFormRequestTab />
                </Tabs.Panel>
                <Tabs.Panel value="functions" pt="md">
                    <ConversationFormFunctionsTab />
                </Tabs.Panel>
                {!hideAppSettings && (
                    <Tabs.Panel value="app" pt="md">
                        <AppSettings />
                    </Tabs.Panel>
                )}
            </Tabs>
            {currentTab !== "app" && (
                <Box>
                    <Button type="submit" fullWidth>
                        Submit
                    </Button>
                    {form.values.save && (
                        <Text size="xs" italic align="center">
                            This conversation will be saved to your browser's
                            local storage. Make sure the device you're using is
                            trusted and not shared with anyone else.
                        </Text>
                    )}
                </Box>
            )}
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
