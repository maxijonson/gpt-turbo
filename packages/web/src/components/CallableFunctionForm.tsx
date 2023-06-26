import { Button, Group, Stack, TextInput } from "@mantine/core";
import CallableFunctionFormProvider, {
    CallableFunctionFormProviderProps,
} from "../contexts/providers/CallableFunctionFormProvider";
import useCallableFunctionForm from "../hooks/useCallableFunctionForm";
import { Link } from "react-router-dom";
import CallableFunctionFormCode from "./CallableFunctionFormCode";
import CallableFunctionFormParameters from "./CallableFunctionFormParameters";
import OptionalTextInput from "./OptionalTextInput";

interface CallableFunctionFormProps {
    onSubmit: CallableFunctionFormProviderProps["onSubmit"];
    id?: string;
}

const CallableFunctionFormProvided = () => {
    const form = useCallableFunctionForm();

    return (
        <Stack pt="md">
            <Group noWrap grow>
                <TextInput
                    {...form.getInputProps("displayName")}
                    label="Display Name"
                    description="This name is used by this website"
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
            <CallableFunctionFormProvided />
        </CallableFunctionFormProvider>
    );
};

export default CallableFunctionForm;
