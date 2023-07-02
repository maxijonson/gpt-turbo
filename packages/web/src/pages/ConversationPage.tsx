import { Button, Divider, Group, Stack, Text } from "@mantine/core";
import AddConversation from "../components/AddConversation";
import useConversationManager from "../hooks/useConversationManager";
import Messages from "../components/Messages";
import Prompt from "../components/Prompt";
import usePersistence from "../hooks/usePersistence";
import ContentLoader from "../components/ContentLoader";
import ConversationPageShell from "../components/ConversationPageShell";
import { useTimeout } from "@mantine/hooks";
import React from "react";

const ConversationPage = () => {
    const { activeConversation } = useConversationManager();
    const { hasInit: hasPersistenceInit } = usePersistence();
    const [longLoading, setLongLoading] = React.useState(false);
    const { start, clear } = useTimeout(() => setLongLoading(true), 5000);

    React.useEffect(() => {
        start();
        return clear;
    }, [start, clear]);

    if (!hasPersistenceInit) {
        return (
            <ContentLoader size="xl">
                <Text size="xl">Loading Saved Data</Text>
                {longLoading && (
                    <Stack>
                        <Text size="sm" color="gray">
                            This is taking a while. Try refreshing the page or
                            deleting your saved data.
                        </Text>
                        <Group position="center">
                            <Button onClick={() => window.location.reload()}>
                                Refresh
                            </Button>
                            <Button
                                variant="outline"
                                color="red"
                                onClick={() => {
                                    localStorage.clear();
                                    window.location.reload();
                                }}
                            >
                                Delete Saved Data
                            </Button>
                        </Group>
                    </Stack>
                )}
            </ContentLoader>
        );
    }

    return (
        <ConversationPageShell>
            {activeConversation ? (
                <Stack h="100%">
                    <Messages />
                    <Divider />
                    <Prompt />
                </Stack>
            ) : (
                <AddConversation />
            )}
        </ConversationPageShell>
    );
};

export default ConversationPage;
