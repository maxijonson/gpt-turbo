import {
    Anchor,
    Button,
    Container,
    Group,
    Kbd,
    List,
    Modal,
    ScrollArea,
    Stack,
    Text,
    Title,
} from "@mantine/core";
import React, { ErrorInfo } from "react";
import { BiBug, BiRefresh, BiTrash } from "react-icons/bi";

export interface AppCatcherProps {
    children?: React.ReactNode;
}

export interface AppCatcherState {
    hasError: boolean;
}

export default class AppCatcher extends React.Component<
    AppCatcherProps,
    AppCatcherState
> {
    constructor(props: AppCatcherProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_error: unknown) {
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error(error, errorInfo);
    }

    render() {
        const { hasError } = this.state;
        const { children } = this.props;

        if (!hasError) {
            return children;
        }

        return (
            <Modal
                opened
                withCloseButton={false}
                closeOnClickOutside={false}
                closeOnEscape={false}
                onClose={() => {}}
                centered
                title={
                    <Title color="red" order={3}>
                        Fatal error
                    </Title>
                }
                color="red"
                size="xl"
                scrollAreaComponent={ScrollArea.Autosize}
            >
                <Stack>
                    <Container>
                        <Text>
                            The application encountered a fatal error. Try to
                            reload the page. If the issue persists, try opening
                            the app in a private tab:
                            <List>
                                <List.Item>
                                    If the app now works in a private tab, you
                                    might have invalid or outdated local storage
                                    data in your browser. Consider clearing your
                                    local storage data{" "}
                                    <Text color="red" weight={700} span>
                                        which will clear all your settings and
                                        conversations
                                    </Text>
                                </List.Item>
                                <List.Item>
                                    If the app still does not work in a private
                                    tab, you might have encountered a bug. You
                                    may report it on the project's{" "}
                                    <Anchor href="https://github.com/maxijonson/gpt-turbo/issues/new?assignees=&labels=needs-triage&projects=&template=bug_report.yml&title=%5BBug%5D%3A">
                                        GitHub issues page
                                    </Anchor>
                                    . In order to help us resolve this issue,
                                    please include a screenshot (or copy paste
                                    the output) of the error in the console (
                                    <Kbd>F12</Kbd>).
                                </List.Item>
                            </List>
                        </Text>
                    </Container>
                    <Group position="right">
                        <Button
                            variant="outline"
                            leftIcon={<BiBug />}
                            onClick={() =>
                                window.open(
                                    "https://github.com/maxijonson/gpt-turbo/issues/new?assignees=&labels=needs-triage&projects=&template=bug_report.yml&title=%5BBug%5D%3A",
                                    "_blank"
                                )
                            }
                        >
                            Report issue on GitHub
                        </Button>
                        <Button
                            variant="outline"
                            color="red"
                            leftIcon={<BiTrash />}
                            onClick={() => {
                                localStorage.clear();
                                window.location.reload();
                            }}
                        >
                            Clear local storage
                        </Button>
                        <Button
                            leftIcon={<BiRefresh />}
                            onClick={() => window.location.reload()}
                        >
                            Reload
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        );
    }
}
