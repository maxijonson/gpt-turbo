import { Container, Loader, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import useConversationManager from "../hooks/useConversationManager";
import { notifications } from "@mantine/notifications";
import React from "react";
import { getMessageCost, getMessageSize } from "gpt-turbo";
import getPriceString from "../utils/getPriceString";
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
    const [usageMode, setUsageMode] = React.useState<"size" | "value">("size");

    const handleSubmit = form.onSubmit(async (values) => {
        if (!conversation || !values.prompt) return;
        form.reset();
        try {
            const message = await conversation.prompt(values.prompt);
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

    if (!conversation) return <Loader />;

    const usageDisplay =
        usageMode === "size"
            ? getMessageSize(form.values.prompt)
            : getPriceString(
                  getMessageCost(
                      form.values.prompt,
                      conversation.getConfig().model,
                      "prompt"
                  )
              );

    return (
        <Container w="100%">
            <form onSubmit={handleSubmit}>
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
                    rightSection={
                        showUsage && (
                            <PromptUsage
                                conversation={conversation}
                                prompt={form.values.prompt}
                                mode={usageMode}
                                onUsageClick={() =>
                                    setUsageMode((m) =>
                                        m === "size" ? "value" : "size"
                                    )
                                }
                            />
                        )
                    }
                    rightSectionWidth={
                        showUsage ? `${usageDisplay}`.length * 8 + 52 : 0
                    }
                />
            </form>
        </Container>
    );
};
