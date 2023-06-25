import { Group, Title, Modal, Badge, Stack, Center } from "@mantine/core";
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
    const [editParameterName, setEditParameterName] = React.useState<
        string | null
    >(null);

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

    const editParameter = React.useMemo(() => {
        if (!editParameterName) return null;
        const currentParameters = form.values.parameters ?? {
            type: "object",
            properties: {},
            required: [],
        };

        const properties =
            currentParameters.properties?.[editParameterName] ?? null;
        if (!properties) return null;

        return {
            name: editParameterName,
            required: (currentParameters.required ?? []).includes(
                editParameterName
            ),
            jsonSchema: JSON.stringify(properties, null, 2),
        };
    }, [editParameterName, form.values.parameters]);

    const handleCloseModal = React.useCallback(() => {
        closeParameterModal();
        setEditParameterName(null);
    }, [closeParameterModal]);

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

            if (editParameterName && editParameterName !== parameter.name) {
                delete next.properties[editParameterName];
                next.required = next.required.filter(
                    (name) => name !== editParameterName
                );
            }

            form.setFieldValue("parameters", {
                ...next,
                required: next.required.length > 0 ? next.required : undefined,
            });
            handleCloseModal();
        },
        [editParameterName, form, handleCloseModal]
    );

    return (
        <>
            <Stack>
                <Title order={3}>Parameters</Title>
                <Group>
                    {parameters.map((parameter) => (
                        <Badge
                            key={parameter.name}
                            variant="filled"
                            sx={{ textTransform: "unset", cursor: "pointer" }}
                            onClick={() => setEditParameterName(parameter.name)}
                        >
                            {parameter.name}
                            {parameter.required ? "" : "?"}: {parameter.type}
                        </Badge>
                    ))}
                    <Badge
                        variant="outline"
                        leftSection={
                            <Center>
                                <BiPlus />
                            </Center>
                        }
                        sx={{ cursor: "pointer" }}
                        onClick={openParameterModal}
                    >
                        Add
                    </Badge>
                </Group>
            </Stack>
            <Modal
                title="Function Parameter"
                opened={showParameterModal || !!editParameter}
                onClose={handleCloseModal}
                centered
                size="lg"
            >
                <CallableFunctionParameterForm
                    onSubmit={onParameterSubmit}
                    onClose={handleCloseModal}
                    parameter={editParameter}
                />
            </Modal>
        </>
    );
};

export default CallableFunctionFormParameters;
