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
import { persistenceConversationSchema } from "../../entities/persistenceConversation";

interface ConversationNameEditModalBaseProps {
    onSubmit: (name: z.infer<typeof schema>["name"]) => void;
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
    ...modalProps
}: ConversationNameEditModalProps) => {
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

    return (
        <Modal centered size="sm" withCloseButton={false} {...modalProps}>
            <form onSubmit={handleSubmit}>
                <Stack>
                    <TextInput
                        label="Name"
                        placeholder="Conversation Name"
                        withAsterisk
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
