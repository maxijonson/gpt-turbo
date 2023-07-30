import {
    Card,
    Grid,
    Group,
    Input,
    NumberInput,
    PasswordInput,
    Select,
    Stack,
    TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { ConversationRequestOptionsModel } from "gpt-turbo";
import React from "react";

interface ProxyInputProps {
    value: ConversationRequestOptionsModel["proxy"] | undefined;
    onChange: (
        value: ConversationRequestOptionsModel["proxy"] | undefined
    ) => void;
}

const ProxyInput = ({ value, onChange }: ProxyInputProps) => {
    const form = useForm({
        initialValues: {
            host: value?.host ?? "",
            port: value?.port,
            protocol: value?.protocol,
            username: value?.auth?.username ?? "",
            password: value?.auth?.password ?? "",
        },
    });

    React.useEffect(() => {
        const { host, port, protocol, username, password } = form.values;
        const next: ConversationRequestOptionsModel["proxy"] | undefined = host
            ? {
                  host,
                  port,
                  protocol,
                  auth:
                      username && password ? { username, password } : undefined,
              }
            : undefined;

        if (JSON.stringify(next) !== JSON.stringify(value)) {
            if (!host) {
                onChange(undefined);
            } else {
                onChange(next);
            }
        }
    }, [form.values, onChange, value]);

    return (
        <Input.Wrapper
            label="Proxy"
            description="Host is required to enable proxy. Other fields are optional, but username and password are both required if proxy requires authentication."
        >
            <Card withBorder p="xs" mt="xs">
                <Stack>
                    <TextInput {...form.getInputProps("host")} label="Host" />
                    <Group>
                        <NumberInput
                            {...form.getInputProps("port")}
                            label="Port"
                            min={1}
                            max={65535}
                            sx={{ flexGrow: 1 }}
                        />
                        <Select
                            {...form.getInputProps("protocol")}
                            data={["http", "https"]}
                            label="Protocol"
                            sx={{ flexGrow: 1 }}
                        />
                    </Group>
                    <Grid>
                        <Grid.Col sm={6} xs={12}>
                            <TextInput
                                {...form.getInputProps("username")}
                                label="Username"
                                sx={{ flexGrow: 1 }}
                            />
                        </Grid.Col>
                        <Grid.Col sm={6} xs={12}>
                            <PasswordInput
                                {...form.getInputProps("password")}
                                label="Password"
                                sx={{ flexGrow: 1 }}
                            />
                        </Grid.Col>
                    </Grid>
                </Stack>
            </Card>
        </Input.Wrapper>
    );
};

export default ProxyInput;
