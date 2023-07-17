import {
    Button,
    Group,
    Modal,
    ModalProps,
    Stack,
    TextInput,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { HiSparkles } from "react-icons/hi";
import { persistenceConversationSchema } from "../../entities/persistenceConversation";
import TippedActionIcon from "../common/TippedActionIcon";
import React from "react";
import { useGenerateConversationName } from "../../store/hooks/conversations/useGenerateConversationName";
import { notifications } from "@mantine/notifications";

interface ConversationNameEditModalBaseProps {
    onSubmit: (name: z.infer<typeof schema>["name"]) => void;
    conversationId: string;
    initialName?: z.infer<typeof schema>["name"];
}

export type ConversationNameEditModalProps = Omit<ModalProps, "onSubmit"> &
    ConversationNameEditModalBaseProps;

const schema = z.object({
    name: persistenceConversationSchema.shape.name,
});

const ConversationNameEditModal = ({
    onSubmit,
    initialName = "",
    conversationId,
    ...modalProps
}: ConversationNameEditModalProps) => {
    const { canGenerate, isGenerating, generateConversationName } =
        useGenerateConversationName(conversationId);
    const form = useForm({
        initialValues: {
            name: initialName,
        },
        validate: zodResolver(schema),
        transformValues: schema.parse,
    });

    const handleSubmit = form.onSubmit(({ name }) => {
        onSubmit(name);
        modalProps.onClose();
    });

    const onGenerate = React.useCallback(async () => {
        const name = await generateConversationName();
        if (!name) {
            notifications.show({
                title: "Failed to generate name",
                message:
                    "This may not be an error. The assistant may not be able to generate a name for this conversation.",
                color: "yellow",
            });
            return;
        }
        form.setFieldValue("name", name);
    }, [form, generateConversationName]);

    return (
        <Modal centered size="sm" withCloseButton={false} {...modalProps}>
            <form onSubmit={handleSubmit}>
                <Stack>
                    <TextInput
                        label="Name"
                        placeholder="Conversation Name"
                        withAsterisk
                        sx={{ flexGrow: 1 }}
                        rightSection={
                            canGenerate && (
                                <TippedActionIcon
                                    tip="Generate name (uses API key)"
                                    withinPortal
                                    onClick={onGenerate}
                                    loading={isGenerating}
                                    variant="gradient"
                                    gradient={{ from: "teal", to: "lime" }}
                                >
                                    <HiSparkles gradientTransform="" />
                                </TippedActionIcon>
                            )
                        }
                        {...form.getInputProps("name")}
                    />
                    <Group position="right">
                        <Button variant="outline" onClick={modalProps.onClose}>
                            Cancel
                        </Button>
                        <Button type="submit">Save</Button>
                    </Group>
                </Stack>
            </form>
        </Modal>
    );
};

export default ConversationNameEditModal;
