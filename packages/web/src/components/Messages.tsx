import { Container, ScrollArea, Stack } from "@mantine/core";
import useConversationManager from "../hooks/useConversationManager";
import Message from "./Message";
import React from "react";

export default () => {
    const { activeConversation: conversation } = useConversationManager();
    const [messages, setMessages] = React.useState(
        conversation?.getMessages() ?? []
    );

    React.useEffect(() => {
        if (!conversation) return;
        const unsubscribeMessageUpdate: (() => void)[] = [];
        const unsubscribeMessageStreaming: (() => void)[] = [];
        const unsubscribeMessageAdded = conversation.onMessageAdded(
            (message) => {
                if (message.role === "system") return;
                setMessages((messages) => [...messages, message]);

                if (message.role !== "assistant") return;

                unsubscribeMessageUpdate.push(
                    message.onMessageUpdate(
                        () => setMessages((messages) => [...messages]) // Force re-render by creating a new array
                    )
                );
            }
        );

        return () => {
            unsubscribeMessageAdded();
            unsubscribeMessageUpdate.forEach((unsubscribe) => unsubscribe());
            unsubscribeMessageStreaming.forEach((unsubscribe) => unsubscribe());
        };
    }, [conversation]);

    React.useEffect(() => {
        if (!conversation) return;
        return conversation.onMessageRemoved((message) => {
            setMessages((messages) =>
                messages.filter((m) => m.id !== message.id)
            );
        });
    }, [conversation]);

    React.useEffect(() => {
        setMessages(conversation?.getMessages() ?? []);
    }, [conversation]);

    return (
        <Container sx={{ flexGrow: 1 }} w="100%" h={0}>
            <ScrollArea h="100%" offsetScrollbars>
                <Stack>
                    {messages.map((message) => (
                        <Message key={message.id} message={message} />
                    ))}
                </Stack>
            </ScrollArea>
        </Container>
    );
};
