import { Group, Title, Modal, Badge, Stack, Center, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { BiPlus, BiX } from "react-icons/bi";
import CallableFunctionParameterForm, {
    CallableFunctionParameterFormProps,
} from "../CallableFunctionParameterForm/CallableFunctionParameterForm";
import useCallableFunctionForm from "../../../contexts/hooks/useCallableFunctionForm";
import React from "react";
import { JsonSchemaObject } from "gpt-turbo";
import getFunctionParameters from "../../../utils/getFunctionParameters";
import TippedActionIcon from "../../common/TippedActionIcon";
import { modals } from "@mantine/modals";

const CallableFunctionFormParameters = () => {
    const form = useCallableFunctionForm();
    const [
        showParameterModal,
        { open: openParameterModal, close: closeParameterModal },
    ] = useDisclosure();
    const [editParameterName, setEditParameterName] = React.useState<
        string | null
    >(null);

    const parameters = React.useMemo(
        () => getFunctionParameters(form.values.parameters),
        [form.values.parameters]
    );

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

    const removeParameter = React.useCallback(
        (name: string) => {
            modals.openConfirmModal({
                title: `Remove ${name}?`,
                centered: true,
                children: (
                    <Text size="sm">
                        Are you sure you want to remove {name} from the
                        parameters? This cannot be undone.
                    </Text>
                ),
                labels: { confirm: "Remove parameter", cancel: "Cancel" },
                confirmProps: { color: "red" },
                onConfirm: () => {
                    const currentParameters = form.values.parameters ?? {
                        type: "object",
                        properties: {},
                    };
                    const next = {
                        ...currentParameters,
                        type: "object",
                        properties: {
                            ...currentParameters.properties,
                        },
                    } satisfies JsonSchemaObject;

                    delete next.properties[name];
                    next.required = (next.required ?? []).filter(
                        (n) => n !== name
                    );

                    if (next.required.length === 0) {
                        delete next.required;
                    }

                    form.setFieldValue("parameters", next);
                },
            });
        },
        [form]
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
                            pr={2}
                            rightSection={
                                <TippedActionIcon
                                    tip="remove"
                                    size="xs"
                                    color="gray.0"
                                    radius="xl"
                                    variant="transparent"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeParameter(parameter.name);
                                    }}
                                >
                                    <BiX />
                                </TippedActionIcon>
                            }
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
