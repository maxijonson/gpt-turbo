import {
    ActionIcon,
    Card,
    Group,
    Input,
    Stack,
    TextInput,
} from "@mantine/core";
import { useListState } from "@mantine/hooks";
import React from "react";
import { BsPlus, BsTrash } from "react-icons/bs";

interface HeadersInputProps {
    value: Record<string, string> | undefined;
    onChange: (value: Record<string, string> | undefined) => void;
}

interface Header {
    header: string | "";
    value: string | "";
}

const getInitialHeaders = (
    value: Record<string, string> | undefined
): Header[] => {
    if (!value) return [{ header: "", value: "" }];

    const entries = Object.entries(value);
    if (entries.length === 0) return [{ header: "", value: "" }];

    return entries
        .map(([header, v]) => ({
            header,
            value: v,
        }))
        .filter(({ header, value: v }) => !!header && !!v);
};

const getValueFromHeaders = (value: Header[]) => {
    const headers = value.filter(({ header, value: v }) => !!header && !!v);

    if (headers.length === 0) return undefined;

    return headers.reduce(
        (acc, { header, value: v }) => {
            acc[header] = v;
            return acc;
        },
        {} as Record<string, string>
    );
};

const HeadersInput = ({ value, onChange }: HeadersInputProps) => {
    const [headers, handlers] = useListState<Header>(getInitialHeaders(value));

    const setHeader = React.useCallback(
        (index: number, header: string | "") => {
            handlers.setItem(index, {
                header,
                value: headers[index].value,
            });
        },
        [handlers, headers]
    );

    const setValue = React.useCallback(
        (index: number, value: string | "") => {
            handlers.setItem(index, {
                header: headers[index].header,
                value,
            });
        },
        [handlers, headers]
    );

    const removeItem = React.useCallback(
        (index: number) => {
            handlers.remove(index);
        },
        [handlers]
    );

    React.useEffect(() => {
        const next = getValueFromHeaders(headers);
        if (JSON.stringify(next) !== JSON.stringify(value)) {
            onChange(next);
        }
    }, [onChange, headers, value]);

    return (
        <Input.Wrapper
            label="Headers"
            description="The 'Proxy-Authorization' header is automatically added for the proxy, with the base64 value of 'username:password'"
        >
            <Card withBorder mt="xs" p="xs">
                <Stack mt="xs" w="100%">
                    {headers.map(({ header, value }, index) => (
                        <Group key={index} noWrap>
                            <TextInput
                                value={header}
                                onChange={(event) =>
                                    setHeader(index, event.currentTarget.value)
                                }
                                placeholder="Header"
                                style={{ flexGrow: 1 }}
                            />
                            <TextInput
                                value={value}
                                onChange={(event) =>
                                    setValue(index, event.currentTarget.value)
                                }
                                placeholder="Value"
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
                            handlers.append({ header: "", value: "" })
                        }
                        title="Add Header"
                    >
                        <BsPlus />
                    </ActionIcon>
                </Group>
            </Card>
        </Input.Wrapper>
    );
};

export default HeadersInput;
