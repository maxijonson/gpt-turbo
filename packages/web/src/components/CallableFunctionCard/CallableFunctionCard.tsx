import {
    Card,
    CardProps,
    Code,
    Group,
    Stack,
    Text,
    Title,
} from "@mantine/core";
import React from "react";
import { CallableFunction } from "gpt-turbo";
import CallableFunctionCardMenu from "./CallableFunctionCardMenu";
import { useGetFunctionDisplayName } from "../../store/hooks/callableFunctions/useGetFunctionDisplayName";

type CallableFunctionCardProps = Omit<CardProps, "children"> & {
    fn: CallableFunction;
};

const CallableFunctionCard = ({
    fn,
    ...cardProps
}: CallableFunctionCardProps) => {
    const getFunctionDisplayName = useGetFunctionDisplayName();
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

    return (
        <Card withBorder {...cardProps}>
            <Card.Section withBorder inheritPadding py="xs">
                <Group position="apart">
                    <Title order={4}>
                        {getFunctionDisplayName(fn.id) ?? "[N/A]"}
                    </Title>
                    <CallableFunctionCardMenu id={fn.id} />
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
