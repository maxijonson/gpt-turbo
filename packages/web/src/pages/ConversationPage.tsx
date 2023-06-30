import { Divider, Stack, Text } from "@mantine/core";
import AddConversation from "../components/AddConversation";
import useConversationManager from "../hooks/useConversationManager";
import Messages from "../components/Messages";
import Prompt from "../components/Prompt";
import usePersistence from "../hooks/usePersistence";
import ContentLoader from "../components/ContentLoader";
import ConversationPageShell from "../components/ConversationPageShell";

const ConversationPage = () => {
    const { activeConversation } = useConversationManager();
    const { hasInit: hasPersistenceInit } = usePersistence();

    if (!hasPersistenceInit) {
        return (
            <ContentLoader size="xl">
                <Text size="xl">Loading Saved Data</Text>
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
