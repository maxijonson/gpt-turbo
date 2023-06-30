import { Card, Code, Text, Title, createStyles } from "@mantine/core";
import React from "react";
import { CallableFunction } from "gpt-turbo";
import useCallableFunctions from "../hooks/useCallableFunctions";

interface CallableFunctionCardProps {
    fn: CallableFunction;
    onClick?: () => void;
}

const useStyles = createStyles(
    (theme, { clickable }: { clickable: boolean }) => ({
        card: {
            cursor: clickable ? "pointer" : "default",
            transition:
                "box-shadow 100ms ease-in, background-color 100ms ease-in",

            "&:hover": {
                boxShadow: theme.shadows.md,
                backgroundColor: theme.colors.gray[0],
            },
        },
    })
);

const CallableFunctionCard = ({ fn, onClick }: CallableFunctionCardProps) => {
    const { getCallableFunctionDisplayName } = useCallableFunctions();
    const { classes } = useStyles({ clickable: !!onClick });

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
        <Card className={classes.card} withBorder onClick={onClick}>
            <Title order={4}>{getCallableFunctionDisplayName(fn.id)}</Title>
            {fn.description && <Text>{fn.description}</Text>}
            <Code>{signature}</Code>
        </Card>
    );
};

export default CallableFunctionCard;
