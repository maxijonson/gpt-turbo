import {
    Group,
    Title,
    Button,
    Modal,
    Card,
    Badge,
    Stack,
    Kbd,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { BiPlus } from "react-icons/bi";
import CallableFunctionParameterForm, {
    CallableFunctionParameterFormProps,
} from "./CallableFunctionParameterForm";
import useCallableFunctionForm from "../hooks/useCallableFunctionForm";
import React from "react";
import { JsonSchemaObject } from "gpt-turbo";

const CallableFunctionFormParameters = () => {
    const form = useCallableFunctionForm();
    const [
        showParameterModal,
        { open: openParameterModal, close: closeParameterModal },
    ] = useDisclosure();

    const parameters = React.useMemo(() => {
        const currentParameters = form.values.parameters ?? {
            type: "object",
            properties: {},
            required: [],
        };
        return Object.entries(currentParameters.properties ?? {}).map(
            ([name, jsonSchema]: [string, any]) => ({
                name,
                type: (() => {
                    if (jsonSchema.type) return jsonSchema.type as string;
                    if (jsonSchema.enum) return "enum";
                    if (jsonSchema.const) return "const";
                    return "unknown";
                })(),
                required: (currentParameters.required ?? []).includes(name),
            })
        );
    }, [form.values.parameters]);

    const onParameterSubmit = React.useCallback<
        CallableFunctionParameterFormProps["onSubmit"]
    >(
        (parameter) => {
            const currentParameters = form.values.parameters ?? {
                type: "object",
                properties: {},
            };
            const next = {
                ...currentParameters,
                type: "object",
                properties: {
                    ...currentParameters.properties,
                    [parameter.name]: parameter.jsonSchema,
                },
            } satisfies JsonSchemaObject;

            next.required = (next.required ?? []).filter(
                (name) => name !== parameter.name
            );

            if (parameter.required) {
                next.required.push(parameter.name);
            }

            form.setFieldValue("parameters", {
                ...next,
                required: next.required.length > 0 ? next.required : undefined,
            });
            closeParameterModal();
        },
        [form, closeParameterModal]
    );

    return (
        <>
            <Stack>
                <Group>
                    <Title order={3}>Parameters</Title>
                    <Button
                        size="xs"
                        variant="outline"
                        leftIcon={<BiPlus />}
                        onClick={openParameterModal}
                    >
                        Add
                    </Button>
                </Group>
                <Group>
                    {parameters.map((parameter) => (
                        <Card key={parameter.name} withBorder shadow="md">
                            <Group noWrap spacing="xs">
                                <Kbd>{parameter.name}</Kbd>
                                <Badge color="blue">
                                    {parameter.type}
                                    {parameter.required ? "" : "?"}
                                </Badge>
                            </Group>
                        </Card>
                    ))}
                </Group>
            </Stack>
            <Modal
                title="Function Parameter"
                opened={showParameterModal}
                onClose={closeParameterModal}
                centered
                size="lg"
            >
                <CallableFunctionParameterForm onSubmit={onParameterSubmit} />
            </Modal>
        </>
    );
};

export default CallableFunctionFormParameters;
