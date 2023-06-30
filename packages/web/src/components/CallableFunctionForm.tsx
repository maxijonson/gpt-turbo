import { Button, Group, Stack, Text, TextInput } from "@mantine/core";
import CallableFunctionFormProvider, {
    CallableFunctionFormProviderProps,
} from "../contexts/providers/CallableFunctionFormProvider";
import useCallableFunctionForm from "../hooks/useCallableFunctionForm";
import { Link, useNavigate } from "react-router-dom";
import CallableFunctionFormCode from "./CallableFunctionFormCode";
import CallableFunctionFormParameters from "./CallableFunctionFormParameters";
import OptionalTextInput from "./OptionalTextInput";
import { modals } from "@mantine/modals";
import React from "react";
import useCallableFunctions from "../hooks/useCallableFunctions";

interface CallableFunctionFormProps {
    onSubmit: CallableFunctionFormProviderProps["onSubmit"];
    id?: string;
}

interface CallableFunctionFormProvidedProps {
    isNew?: boolean;
}

const CallableFunctionFormProvided = ({
    isNew = false,
}: CallableFunctionFormProvidedProps) => {
    const form = useCallableFunctionForm();
    const { deleteCallableFunction } = useCallableFunctions();
    const navigate = useNavigate();

    const openDeleteModal = React.useCallback(() => {
        const id = form.values.id;
        if (!id) return;
        modals.openConfirmModal({
            title: `Delete ${form.values.displayName}?`,
            centered: true,
            children: (
                <Text size="sm">
                    Are you sure you want to delete {form.values.displayName}?
                    This cannot be undone.
                </Text>
            ),
            labels: { confirm: "Delete function", cancel: "Cancel" },
            confirmProps: { color: "red" },
            onConfirm: () => {
                deleteCallableFunction(id);
                navigate("/functions");
            },
        });
    }, [
        deleteCallableFunction,
        form.values.displayName,
        form.values.id,
        navigate,
    ]);

    return (
        <Stack pt="md">
            <Group noWrap grow>
                <TextInput
                    {...form.getInputProps("displayName")}
                    label="Display Name"
                    description="This name is used by this website"
                    withAsterisk
                />
                <TextInput
                    {...form.getInputProps("name")}
                    label="Name"
                    description="This name is used by the assistant"
                    withAsterisk
                />
            </Group>
            <OptionalTextInput
                {...form.getInputProps("description")}
                label="Description"
                description="While optionnal, a description is strongly recommended to help the assistant know what this function does"
            />
            <CallableFunctionFormParameters />
            <CallableFunctionFormCode />
            <Group position="right">
                {!isNew && (
                    <Button
                        variant="outline"
                        color="red"
                        onClick={openDeleteModal}
                    >
                        Delete
                    </Button>
                )}
                <Button component={Link} to="/functions" variant="outline">
                    Cancel
                </Button>
                <Button type="submit">Submit</Button>
            </Group>
        </Stack>
    );
};

const CallableFunctionForm = ({ onSubmit, id }: CallableFunctionFormProps) => {
    return (
        <CallableFunctionFormProvider onSubmit={onSubmit} id={id}>
            <CallableFunctionFormProvided isNew={!id} />
        </CallableFunctionFormProvider>
    );
};

export default CallableFunctionForm;
