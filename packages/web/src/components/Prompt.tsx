import { Container, Group, Loader, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import useConversationManager from "../hooks/useConversationManager";
import { notifications } from "@mantine/notifications";
import React from "react";
import PromptUsage from "./PromptUsage";
import {
    useClickOutside,
    useFocusReturn,
    useFocusWithin,
    useMergedRef,
} from "@mantine/hooks";

export default () => {
    const { activeConversation: conversation, showUsage } =
        useConversationManager();
    const form = useForm({
        initialValues: {
            prompt: "",
        },
    });
    const [isStreaming, setIsStreaming] = React.useState(false);

    const [shouldReturnFocus, setShouldReturnFocus] = React.useState(false);
    const { ref: focusWithinRef, focused } = useFocusWithin({
        onFocus: () => setShouldReturnFocus(true),
    });
    const clickOutsideRef = useClickOutside(() => setShouldReturnFocus(false));
    const textAreaRef = useMergedRef(focusWithinRef, clickOutsideRef);
    const returnFocus = useFocusReturn({
        opened: focused,
        shouldReturnFocus,
    });

    const handleSubmit = form.onSubmit(async (values) => {
        if (!conversation || !values.prompt) return;
        form.reset();
        try {
            const message = await conversation.prompt(values.prompt);
            if (message) {
                message.onMessageStreamingUpdate((isStreaming) => {
                    setIsStreaming(isStreaming);
                });
                if (message.isStreaming) {
                    setIsStreaming(true);
                }
            }
        } catch (e) {
            console.error(e);
            notifications.show({
                title: "Prompt error",
                message: (e as any).message ?? "Unknown error",
                color: "red",
            });
        }
    });

    React.useEffect(() => {
        if (shouldReturnFocus) {
            returnFocus();
        }
    }, [returnFocus, shouldReturnFocus]);

    if (!conversation) return <Loader />;

    return (
        <Container w="100%">
            <Group>
                <form onSubmit={handleSubmit} style={{ flexGrow: 1 }}>
                    <Textarea
                        {...form.getInputProps("prompt")}
                        ref={textAreaRef}
                        disabled={isStreaming}
                        autosize
                        minRows={1}
                        maxRows={8}
                        w="100%"
                        placeholder="Ask away..."
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit();
                            }
                        }}
                    />
                </form>
                {showUsage && (
                    <PromptUsage
                        conversation={conversation}
                        prompt={form.values.prompt}
                    />
                )}
            </Group>
        </Container>
    );
};
