import { Button, Group, Stack, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import usePersistence from "../hooks/usePersistence";
import { persistenceContextSchema } from "../entities/persistenceContext";
import { z } from "zod";
import { persistencePromptSchema } from "../entities/persistencePrompt";

interface SaveContextModalBodyProps {
    value: string;
    close: () => void;
    mode: "context" | "prompt";
}

const SavePromptModalBody = ({
    value,
    close,
    mode,
}: SaveContextModalBodyProps) => {
    const {
        saveContext,
        savePrompt,
        persistence: { contexts, prompts },
    } = usePersistence();

    const save = mode === "context" ? saveContext : savePrompt;
    const items = mode === "context" ? contexts : prompts;
    const schema =
        mode === "context" ? persistenceContextSchema : persistencePromptSchema;

    const form = useForm({
        initialValues: {
            name: "",
        },
        validate: zodResolver(
            z.object({
                name: schema.shape.name.and(
                    z
                        .string()
                        .refine(
                            (n) =>
                                !items.find(
                                    (c) =>
                                        c.name.toLowerCase() === n.toLowerCase()
                                ),
                            {
                                message: "Name already exists",
                            }
                        )
                ),
            })
        ),
    });

    const onSubmit = form.onSubmit((values) => {
        save({
            name: values.name,
            value,
        });
        close();
    });

    return (
        <form
            onSubmit={(e) => {
                e.stopPropagation();
                onSubmit(e);
            }}
        >
            <Stack>
                <TextInput
                    {...form.getInputProps("name")}
                    label="Name"
                    placeholder={value}
                    data-autofocus
                />
                <Group position="right">
                    <Button onClick={close} variant="outline">
                        Cancel
                    </Button>
                    <Button type="submit">Save</Button>
                </Group>
            </Stack>
        </form>
    );
};

export default SavePromptModalBody;
