import {
    ActionIcon,
    Card,
    Code,
    Group,
    Menu,
    Stack,
    Text,
    Title,
} from "@mantine/core";
import React from "react";
import { CallableFunction } from "gpt-turbo";
import useCallableFunctions from "../hooks/useCallableFunctions";
import { BiDotsVerticalRounded, BiDuplicate, BiEdit } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { modals } from "@mantine/modals";
import { BsTrash } from "react-icons/bs";

interface CallableFunctionCardProps {
    fn: CallableFunction;
}

const CallableFunctionCard = ({ fn }: CallableFunctionCardProps) => {
    const navigate = useNavigate();
    const {
        getCallableFunctionDisplayName,
        deleteCallableFunction,
        addCallableFunction,
        getCallableFunctionCode,
        callableFunctions,
    } = useCallableFunctions();

    const signature = React.useMemo(() => {
        const parameters = [
            ...fn.requiredParameters,
            ...fn.optionalParameters,
        ].map((parameter) => ({
            name: parameter.name,
            type: parameter.type,
            required: fn.requiredParameters.includes(parameter),
        }));

        let signature = `${fn.name}(`;
        signature += parameters
            .map(({ name, required, type }) => {
                return `${name}${required ? "" : "?"}: ${type}`;
            })
            .join(", ");
        signature += ")";
        return signature;
    }, [fn.name, fn.optionalParameters, fn.requiredParameters]);

    const onEdit = React.useCallback(
        () => navigate(`/functions/edit/${fn.id}`),
        [fn.id, navigate]
    );

    const onDuplicate = React.useCallback(() => {
        const displayName = getCallableFunctionDisplayName(fn.id);

        const copyDisplayName = (() => {
            let i = 1;
            let copy = `${displayName} (${i})`;
            while (
                callableFunctions.some(
                    (fn) => getCallableFunctionDisplayName(fn.id) === copy
                )
            ) {
                i++;
                copy = `${displayName} (${i})`;
            }
            return copy;
        })();

        const copyName = (() => {
            let i = 1;
            let copy = `${fn.name}${i}`;
            while (callableFunctions.some((fn) => fn.name === copy)) {
                i++;
                copy = `${fn.name}${i}`;
            }
            return copy;
        })();

        modals.openConfirmModal({
            title: `Duplicate ${displayName}?`,
            centered: true,
            children: (
                <Text size="sm">
                    This will create a new function with the same config and
                    code, but the display name and function name will appear as{" "}
                    <Text span weight="bold">
                        {copyDisplayName}
                    </Text>{" "}
                    and{" "}
                    <Text span weight="bold">
                        {copyName}
                    </Text>
                </Text>
            ),
            labels: { confirm: "Duplicate function", cancel: "Cancel" },
            onConfirm: () => {
                addCallableFunction(
                    {
                        ...fn.toJSON(),
                        id: undefined,
                        name: copyName,
                    },
                    copyDisplayName,
                    getCallableFunctionCode(fn.id)
                );
            },
        });
    }, [
        addCallableFunction,
        callableFunctions,
        fn,
        getCallableFunctionCode,
        getCallableFunctionDisplayName,
    ]);

    const onDelete = React.useCallback(() => {
        const displayName = getCallableFunctionDisplayName(fn.id);
        modals.openConfirmModal({
            title: `Delete ${displayName}?`,
            centered: true,
            children: (
                <Text size="sm">
                    Are you sure you want to delete {displayName}? This cannot
                    be undone.
                </Text>
            ),
            labels: { confirm: "Delete function", cancel: "Cancel" },
            confirmProps: { color: "red" },
            onConfirm: () => {
                deleteCallableFunction(fn.id);
            },
        });
    }, [deleteCallableFunction, fn.id, getCallableFunctionDisplayName]);

    return (
        <Card withBorder>
            <Card.Section withBorder inheritPadding py="xs">
                <Group position="apart">
                    <Title order={4}>
                        {getCallableFunctionDisplayName(fn.id)}
                    </Title>
                    <Menu withinPortal withArrow position="bottom-end">
                        <Menu.Target>
                            <ActionIcon>
                                <BiDotsVerticalRounded />
                            </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Item
                                color="blue"
                                onClick={onEdit}
                                icon={<BiEdit />}
                            >
                                Edit
                            </Menu.Item>
                            <Menu.Item
                                onClick={onDuplicate}
                                icon={<BiDuplicate />}
                            >
                                Duplicate
                            </Menu.Item>
                            <Menu.Item
                                onClick={onDelete}
                                icon={<BsTrash />}
                                color="red"
                            >
                                Delete
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Group>
            </Card.Section>
            <Card.Section inheritPadding pt="xs" pb="xl" h="100%">
                <Stack justify="space-between" h="100%" spacing={0}>
                    {fn.description && <Text>{fn.description}</Text>}
                    <Code block>{signature}</Code>
                </Stack>
            </Card.Section>
        </Card>
    );
};

export default CallableFunctionCard;
