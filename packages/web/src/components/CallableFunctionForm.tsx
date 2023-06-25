import { Box, Button, Group, Stack, Text, TextInput } from "@mantine/core";
import CallableFunctionFormProvider, {
    CallableFunctionFormProviderProps,
} from "../contexts/providers/CallableFunctionFormProvider";
import React from "react";
import useCallableFunctionForm from "../hooks/useCallableFunctionForm";
import CallableFunctionDisplayNameInput from "./CallableFunctionDisplayNameInput";
import { Link } from "react-router-dom";
import CallableFunctionFormCode from "./CallableFunctionFormCode";
import CallableFunctionFormParameters from "./CallableFunctionFormParameters";
import OptionalTextInput from "./OptionalTextInput";

interface CallableFunctionFormProvidedProps {
    error?: string | null;
}

type CallableFunctionFormProps = CallableFunctionFormProvidedProps & {
    onSubmit: CallableFunctionFormProviderProps["onSubmit"];
    id?: string;
};

const CallableFunctionFormProvided = ({
    error = null,
}: CallableFunctionFormProvidedProps) => {
    const form = useCallableFunctionForm();

    return (
        <Stack pt="md">
            <CallableFunctionDisplayNameInput
                {...form.getInputProps("displayName")}
                validate={() => form.validateField("displayName")}
            />
            <Group align="start" noWrap grow>
                <Box>
                    <TextInput
                        {...form.getInputProps("name")}
                        label="Name"
                        description="This is the name used by the AI assistant"
                        withAsterisk
                    />
                </Box>
                <Box miw={575}>
                    <OptionalTextInput
                        {...form.getInputProps("description")}
                        label="Description"
                        description="While optionnal, a description is strongly recommended to help the assistant know what this function does"
                    />
                </Box>
            </Group>
            <CallableFunctionFormParameters />
            <CallableFunctionFormCode />
            <Group position="right">
                <Button component={Link} to="/functions" variant="outline">
                    Cancel
                </Button>
                <Button type="submit">Submit</Button>
            </Group>
            {error && (
                <Text color="red" align="right">
                    {error}
                </Text>
            )}
        </Stack>
    );
};

const CallableFunctionForm = ({
    onSubmit,
    id,
    error,
}: CallableFunctionFormProps) => {
    return (
        <CallableFunctionFormProvider onSubmit={onSubmit} id={id}>
            <CallableFunctionFormProvided error={error} />
        </CallableFunctionFormProvider>
    );
};

export default CallableFunctionForm;
