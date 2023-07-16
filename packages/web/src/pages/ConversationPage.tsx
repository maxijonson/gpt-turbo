import { Divider, Stack } from "@mantine/core";
import AddConversation from "../components/AddConversation";
import Messages from "../components/Messages/Messages";
import Prompt from "../components/inputs/Prompt/Prompt";
import ConversationPageShell from "../components/ConversationPageShell";
import React from "react";
import { persistStore } from "../store/persist/triggerPersist";
import { useActiveConversation } from "../store/hooks/conversations/useActiveConversation";

const ConversationPage = () => {
    const activeConversation = useActiveConversation();

    React.useEffect(() => {
        if (!activeConversation) return;
        const unsubs: (() => void)[] = [];

        unsubs.push(
            activeConversation.onMessageAdded((message) => {
                if (message.content) {
                    persistStore();
                }

                unsubs.push(
                    message.onMessageStreamingStop(() => {
                        persistStore();
                    })
                );
            }),
            activeConversation.onMessageRemoved(() => {
                persistStore();
            })
        );

        return () => {
            unsubs.forEach((u) => u());
        };
    }, [activeConversation]);

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
