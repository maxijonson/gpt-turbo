import { Card, Code, Text, Title } from "@mantine/core";
import { PersistenceCallableFunction } from "../entities/persistenceCallableFunction";
import React from "react";
import { Link } from "react-router-dom";

interface CallableFunctionCardProps {
    fn: PersistenceCallableFunction;
}

const CallableFunctionCard = ({ fn }: CallableFunctionCardProps) => {
    const parameters = React.useMemo(() => {
        if (!fn.parameters?.properties) return [];
        const params = Object.entries(fn.parameters.properties).map(
            ([name, parameter]: [string, any]) => {
                const type = (() => {
                    if (parameter.type) return parameter.type as string;
                    if (parameter.enum) return "enum";
                    if (parameter.const) return "const";
                    return "unknown";
                })();
                const required = (fn.parameters?.required ?? []).includes(name);
                return { name, required, type };
            }
        );
        return params.sort((a, b) => {
            if (a.required && !b.required) return -1;
            if (!a.required && b.required) return 1;
            return 0;
        });
    }, [fn.parameters]);

    const signature = React.useMemo(() => {
        let signature = `${fn.name}(`;
        signature += parameters
            .map((param) => {
                return `${param.name}${param.required ? "" : "?"}: ${
                    param.type
                }`;
            })
            .join(", ");
        signature += ")";
        return signature;
    }, [fn.name, parameters]);

    return (
        <Card
            component={Link}
            to={`/functions/${fn.id}`}
            key={fn.id}
            withBorder
            shadow="md"
        >
            <Title order={4}>{fn.displayName}</Title>
            <Text>{fn.description}</Text>
            <Code>{signature}</Code>
        </Card>
    );
};

export default CallableFunctionCard;
