import { Button, Group, Stack, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { persistenceSavedContextSchema } from "../../entities/persistenceSavedContext";
import { z } from "zod";
import { persistenceSavedPromptSchema } from "../../entities/persistenceSavedPrompt";
import { useAppStore } from "../../store";
import { saveContext } from "../../store/actions/savedContexts/saveContext";
import { savePrompt } from "../../store/actions/savedPrompts/savePrompt";

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
    const savedContexts = useAppStore((state) => state.savedContexts);
    const savedPrompts = useAppStore((state) => state.savedPrompts);

    const save = mode === "context" ? saveContext : savePrompt;
    const items = mode === "context" ? savedContexts : savedPrompts;
    const schema =
        mode === "context"
            ? persistenceSavedContextSchema
            : persistenceSavedPromptSchema;

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
        save(values.name, value);
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
