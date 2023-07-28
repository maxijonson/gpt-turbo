import {
    Container,
    ScrollArea,
    Stack,
    createStyles,
    useMantineTheme,
} from "@mantine/core";
import Message from "./Message";
import React from "react";
import { useMediaQuery } from "@mantine/hooks";
import { CallableFunction, FunctionCallMessage } from "gpt-turbo";
import { useActiveConversation } from "../../store/hooks/conversations/useActiveConversation";
import { useCallFunction } from "../../store/hooks/callableFunctions/useCallFunction";

const useStyles = createStyles(() => ({
    scrollArea: {
        "& > div": {
            display: "block !important",
        },
    },
}));

const Messages = () => {
    const conversation = useActiveConversation();
    const [messages, setMessages] = React.useState(
        conversation?.history.getMessages() ?? []
    );
    const callFunction = useCallFunction();
    const viewport = React.useRef<HTMLDivElement>(null);
    const [isSticky, setIsSticky] = React.useState(true);
    const { classes } = useStyles();

    const theme = useMantineTheme();
    const isSm = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

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

    const handleFunctionCall = React.useCallback(
        async (message: FunctionCallMessage, fns: CallableFunction[]) => {
            if (!conversation) return;
            const { name, arguments: args } = message.functionCall;

            const fn = fns.find((f) => f.name === name);
            if (!fn) return;

            const result = await callFunction(fn.id, args);
            if (result === undefined) return;

            conversation.functionPrompt(name, result);
        },
        [callFunction, conversation]
    );

    React.useEffect(() => {
        scrollToBottom();
    }, [scrollToBottom, conversation]);

    React.useEffect(() => {
        if (!conversation) return;
        const unsubscribes: (() => void)[] = [];
        const unsubscribeMessageAdded = conversation.history.onMessageAdded(
            (message) => {
                if (message.role === "system") return;
                setMessages((messages) => [...messages, message]);

                if (isSticky) scrollToBottom();

                if (message.role !== "assistant") return;

                unsubscribes.push(
                    message.onUpdate(() => {
                        setMessages((messages) => [...messages]); // Force re-render by creating a new array
                        if (isSticky) scrollToBottom();
                    })
                );

                const isStreaming = conversation.config.getConfig().stream;
                if (isStreaming) {
                    const unsubscribeStreamingStop = message.onStreamingStop(
                        (message) => {
                            unsubscribeStreamingStop();
                            if (!message.isFunctionCall()) return;
                            handleFunctionCall(
                                message,
                                conversation.callableFunctions.getFunctions()
                            );
                        }
                    );
                    unsubscribes.push(unsubscribeStreamingStop);
                } else if (message.isFunctionCall()) {
                    handleFunctionCall(
                        message,
                        conversation.callableFunctions.getFunctions()
                    );
                }
            }
        );

        return () => {
            unsubscribeMessageAdded();
            unsubscribes.forEach((unsubscribe) => unsubscribe());
        };
    }, [conversation, handleFunctionCall, isSticky, scrollToBottom]);

    React.useEffect(() => {
        if (!conversation) return;
        return conversation.history.onMessageRemoved((message) => {
            setMessages((messages) =>
                messages.filter((m) => m.id !== message.id)
            );
        });
    }, [conversation]);

    React.useEffect(() => {
        setMessages(conversation?.history.getMessages() ?? []);
    }, [conversation]);

    return (
        <Container
            sx={{ flexGrow: 1 }}
            w="100%"
            h={0}
            p={0}
            pt={isSm ? "xl" : 0}
        >
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

export default Messages;
