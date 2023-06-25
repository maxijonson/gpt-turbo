import { Box, Button, Group, Stack, Text, TextInput } from "@mantine/core";
import CallableFunctionFormProvider, {
    CallableFunctionFormProviderProps,
} from "../contexts/providers/CallableFunctionFormProvider";
import React from "react";
import useCallableFunctionForm from "../hooks/useCallableFunctionForm";
import CallableFunctionDisplayNameInput from "./CallableFunctionDisplayNameInput";
import { Link, useNavigate } from "react-router-dom";
import CallableFunctionFormCode from "./CallableFunctionFormCode";
import CallableFunctionFormParameters from "./CallableFunctionFormParameters";
import OptionalTextInput from "./OptionalTextInput";
import usePersistence from "../hooks/usePersistence";
import getErrorInfo from "../utils/getErrorInfo";

interface CallableFunctionFormProvidedProps {
    error?: string | null;
}

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
                <Button type="submit">Create</Button>
            </Group>
            {error && (
                <Text color="red" align="right">
                    {error}
                </Text>
            )}
        </Stack>
    );
};

const CallableFunctionForm = () => {
    const { saveCallableFunction } = usePersistence();
    const navigate = useNavigate();
    const [error, setError] = React.useState<string | null>(null);

    const onSubmit = React.useCallback<
        CallableFunctionFormProviderProps["onSubmit"]
    >(
        (values) => {
            try {
                saveCallableFunction(values);
                navigate("/functions");
            } catch (e) {
                setError(getErrorInfo(e).message);
            }
        },
        [navigate, saveCallableFunction]
    );

    return (
        <CallableFunctionFormProvider onSubmit={onSubmit}>
            <CallableFunctionFormProvided error={error} />
        </CallableFunctionFormProvider>
    );
};

export default CallableFunctionForm;
