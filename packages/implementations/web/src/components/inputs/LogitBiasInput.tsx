import {
    ActionIcon,
    Anchor,
    Card,
    Group,
    Input,
    NumberInput,
    Stack,
    Text,
} from "@mantine/core";
import { useListState } from "@mantine/hooks";
import React from "react";
import { BsPlus, BsTrash } from "react-icons/bs";

interface LogitBiasInputProps {
    value: Record<string, number> | undefined;
    onChange: (value: Record<string, number> | undefined) => void;
}

interface LogitBias {
    token: number | "";
    probability: number | "";
}

const getInitialTokens = (
    value: Record<string, number> | undefined
): LogitBias[] => {
    if (!value) return [{ token: "", probability: "" }];

    const entries = Object.entries(value);
    if (entries.length === 0) return [{ token: "", probability: "" }];

    return entries
        .map(([token, probability]) => ({
            token: Number(token),
            probability: Number(probability),
        }))
        .filter(
            ({ token, probability }) => !isNaN(token) && !isNaN(probability)
        );
};

const getValueFromTokens = (value: LogitBias[]) => {
    const tokens = value.filter(
        ({ token, probability }) =>
            token !== "" &&
            probability !== "" &&
            !isNaN(token) &&
            !isNaN(probability)
    );

    if (tokens.length === 0) return undefined;

    return tokens.reduce(
        (acc, { token, probability }) => {
            acc[token] = Number(probability);
            return acc;
        },
        {} as Record<string, number>
    );
};

const LogitBiasInput = ({ value, onChange }: LogitBiasInputProps) => {
    const [tokens, handlers] = useListState<LogitBias>(getInitialTokens(value));

    const setToken = React.useCallback(
        (index: number, tokenId: number | "") => {
            handlers.setItem(index, {
                token: tokenId,
                probability: tokens[index].probability,
            });
        },
        [handlers, tokens]
    );

    const setProbability = React.useCallback(
        (index: number, probability: number | "") => {
            handlers.setItem(index, {
                token: tokens[index].token,
                probability,
            });
        },
        [handlers, tokens]
    );

    const removeItem = React.useCallback(
        (index: number) => {
            handlers.remove(index);
        },
        [handlers]
    );

    React.useEffect(() => {
        const next = getValueFromTokens(tokens);
        if (JSON.stringify(next) !== JSON.stringify(value)) {
            onChange(next);
        }
    }, [onChange, tokens, value]);

    return (
        <Input.Wrapper
            label="Logit Bias"
            description={
                <Text>
                    See{" "}
                    <Anchor href="https://platform.openai.com/tokenizer">
                        OpenAI's Tokenizer
                    </Anchor>{" "}
                    for token IDs.
                </Text>
            }
        >
            <Card withBorder p="xs">
                <Stack>
                    {tokens.map(({ token, probability }, index) => (
                        <Group key={index} noWrap>
                            <NumberInput
                                value={token}
                                onChange={(value) => setToken(index, value)}
                                placeholder="Token ID"
                                min={0}
                                style={{ flexGrow: 1 }}
                            />
                            <NumberInput
                                value={probability}
                                onChange={(value) =>
                                    setProbability(index, value)
                                }
                                placeholder="Probability"
                                min={-100}
                                max={100}
                                style={{ flexGrow: 1 }}
                            />
                            <ActionIcon
                                color="red"
                                onClick={() => removeItem(index)}
                            >
                                <BsTrash />
                            </ActionIcon>
                        </Group>
                    ))}
                </Stack>
                <Group position="center" mt="md">
                    <ActionIcon
                        variant="outline"
                        color="blue"
                        onClick={() =>
                            handlers.append({ token: "", probability: "" })
                        }
                        title="Add token"
                    >
                        <BsPlus />
                    </ActionIcon>
                </Group>
            </Card>
        </Input.Wrapper>
    );
};

export default LogitBiasInput;
