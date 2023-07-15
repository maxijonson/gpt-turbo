import { Button, Center, Group, Loader, Stack, TextInput } from "@mantine/core";
import CallableFunctionFormProvider, {
    CallableFunctionFormProviderProps,
} from "../../../contexts/providers/CallableFunctionFormProvider";
import useCallableFunctionForm from "../../../contexts/hooks/useCallableFunctionForm";
import { Link, useNavigate } from "react-router-dom";
import CallableFunctionFormParameters from "./CallableFunctionFormParameters";
import OptionalTextInput from "../../inputs/OptionalTextInput";
import React, { Suspense } from "react";
import { deleteCallableFunction } from "../../../store/actions/callableFunctions/deleteCallableFunction";

const CallableFunctionFormCode = React.lazy(
    () => import("./CallableFunctionFormCode")
);

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
    const navigate = useNavigate();

    const handleDelete = React.useCallback(async () => {
        const id = form.values.id;
        if (!id) return;

        const deleted = await deleteCallableFunction(id);
        if (!deleted) return;

        navigate("/functions");
    }, [form.values.id, navigate]);

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
            <Suspense
                fallback={
                    <Center>
                        <Loader />
                    </Center>
                }
            >
                <CallableFunctionFormCode />
            </Suspense>
            <Group position="right">
                {!isNew && (
                    <Button
                        variant="outline"
                        color="red"
                        onClick={handleDelete}
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
