import { Container, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import useConversationManager from "../hooks/useConversationManager";

export default () => {
    const { activeConversation: conversation } = useConversationManager();
    const form = useForm({
        initialValues: {
            message: "",
        },
    });

    const handleSubmit = form.onSubmit(async (values) => {
        if (!conversation) return;
        await conversation.prompt(values.message);
        form.reset();
    });

    return (
        <Container w="100%">
            <form onSubmit={handleSubmit}>
                <Textarea
                    {...form.getInputProps("message")}
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
