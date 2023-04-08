import { ActionIcon, Container, Group, Loader, Textarea } from "@mantine/core";
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
    useOs,
} from "@mantine/hooks";
import { BiPaperPlane } from "react-icons/bi";

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
    const textAreaRef = React.useRef<HTMLTextAreaElement>(null);
    const textAreaRefs = useMergedRef(
        focusWithinRef,
        clickOutsideRef,
        textAreaRef
    );
    const returnFocus = useFocusReturn({
        opened: focused,
        shouldReturnFocus,
    });
    const isMobile = ["ios", "android"].includes(useOs());
    const formRef = React.useRef<HTMLFormElement>(null);

    const handleSubmit = form.onSubmit(async (values) => {
        if (!conversation || !values.prompt) return;

        if (isMobile) {
            textAreaRef.current?.blur();
        }

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
        if (shouldReturnFocus && !isMobile) {
            returnFocus();
        }
    }, [isMobile, returnFocus, shouldReturnFocus]);

    if (!conversation) return <Loader />;

    return (
        <Container w="100%">
            <Group>
                <form
                    onSubmit={handleSubmit}
                    style={{ flexGrow: 1 }}
                    ref={formRef}
                >
                    <Textarea
                        {...form.getInputProps("prompt")}
                        ref={textAreaRefs}
                        disabled={isStreaming}
                        autosize
                        minRows={1}
                        maxRows={8}
                        w="100%"
                        placeholder="Ask away..."
                        rightSection={
                            <ActionIcon
                                onClick={() => formRef.current?.requestSubmit()}
                            >
                                <BiPaperPlane />
                            </ActionIcon>
                        }
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                formRef.current?.requestSubmit();
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
