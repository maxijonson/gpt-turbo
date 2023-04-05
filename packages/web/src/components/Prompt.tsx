import { Container, Group, Loader, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import useConversationManager from "../hooks/useConversationManager";
import { notifications } from "@mantine/notifications";
import React from "react";
import PromptUsage from "./PromptUsage";

export default () => {
    const { activeConversation: conversation, showUsage } =
        useConversationManager();
    const form = useForm({
        initialValues: {
            prompt: "",
        },
    });
    const [isStreaming, setIsStreaming] = React.useState(false);

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

    if (!conversation) return <Loader />;

    return (
        <Container w="100%">
            <Group>
                <form onSubmit={handleSubmit} style={{ flexGrow: 1 }}>
                    <Textarea
                        {...form.getInputProps("prompt")}
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
