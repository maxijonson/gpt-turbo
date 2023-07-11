import { Divider, Stack } from "@mantine/core";
import AddConversation from "../components/AddConversation";
import useConversationManager from "../hooks/useConversationManager";
import Messages from "../components/Messages";
import Prompt from "../components/Prompt";
import ConversationPageShell from "../components/ConversationPageShell";
import React from "react";

const ConversationPage = () => {
    const { activeConversation } = useConversationManager();

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
