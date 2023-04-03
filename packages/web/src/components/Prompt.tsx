import { Container, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import useConversationManager from "../hooks/useConversationManager";
import { notifications } from "@mantine/notifications";
import React from "react";

export default () => {
    const { activeConversation: conversation } = useConversationManager();
    const form = useForm({
        initialValues: {
            message: "",
        },
    });
    const [isStreaming, setIsStreaming] = React.useState(false);

    const handleSubmit = form.onSubmit(async (values) => {
        if (!conversation || !values.message) return;
        form.reset();
        try {
            const message = await conversation.prompt(values.message);
            if (message) {
                message.onMessageStreamingUpdate((isStreaming) => {
                    setIsStreaming(isStreaming);
                });
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

    return (
        <Container w="100%">
            <form onSubmit={handleSubmit}>
                <Textarea
                    {...form.getInputProps("message")}
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
        </Container>
    );
};
