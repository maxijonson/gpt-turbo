import { Container, ScrollArea, Stack, createStyles } from "@mantine/core";
import useConversationManager from "../hooks/useConversationManager";
import Message from "./Message";
import React from "react";

const useStyles = createStyles(() => ({
    scrollArea: {
        "& > div": {
            display: "block !important",
        },
    },
}));

export default () => {
    const { activeConversation: conversation } = useConversationManager();
    const [messages, setMessages] = React.useState(
        conversation?.getMessages() ?? []
    );
    const viewport = React.useRef<HTMLDivElement>(null);
    const [isSticky, setIsSticky] = React.useState(true);
    const { classes } = useStyles();

    const scrollToBottom = React.useCallback(() => {
        setTimeout(() => {
            viewport.current?.scrollTo({
                top: viewport.current.scrollHeight,
            });
        }, 0);
        setIsSticky(true);
    }, []);

    const onScrollPositionChange = React.useCallback(
        ({ y }: { x: number; y: number }) => {
            const bottomY = y + (viewport.current?.clientHeight ?? 0);
            setIsSticky(bottomY === viewport.current?.scrollHeight);
        },
        []
    );

    React.useEffect(() => {
        scrollToBottom();
    }, [scrollToBottom, conversation]);

    React.useEffect(() => {
        if (!conversation) return;
        const unsubscribeMessageUpdate: (() => void)[] = [];
        const unsubscribeMessageAdded = conversation.onMessageAdded(
            (message) => {
                if (message.role === "system") return;
                setMessages((messages) => [...messages, message]);

                if (isSticky) scrollToBottom();

                if (message.role !== "assistant") return;

                unsubscribeMessageUpdate.push(
                    message.onMessageUpdate(() => {
                        setMessages((messages) => [...messages]); // Force re-render by creating a new array
                        if (isSticky) scrollToBottom();
                    })
                );
            }
        );

        return () => {
            unsubscribeMessageAdded();
            unsubscribeMessageUpdate.forEach((unsubscribe) => unsubscribe());
        };
    }, [conversation, isSticky, scrollToBottom]);

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
        <Container sx={{ flexGrow: 1 }} w="100%" h={0} p={0}>
            <ScrollArea
                classNames={{
                    viewport: classes.scrollArea,
                }}
                h="100%"
                offsetScrollbars
                onScrollPositionChange={onScrollPositionChange}
                viewportRef={viewport}
            >
                <Stack>
                    {messages.map((message) => (
                        <Message key={message.id} message={message} />
                    ))}
                </Stack>
            </ScrollArea>
        </Container>
    );
};
